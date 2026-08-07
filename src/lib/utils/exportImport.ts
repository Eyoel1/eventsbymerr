import { db } from '../db/db';

export async function exportAllData(): Promise<void> {
  const [profiles, exercises, programs, programDays, workoutSessions, setLogs, bodyMetrics, reviews] =
    await Promise.all([
      db.profiles.toArray(),
      db.exercises.toArray(),
      db.programs.toArray(),
      db.programDays.toArray(),
      db.workoutSessions.toArray(),
      db.setLogs.toArray(),
      db.bodyMetrics.toArray(),
      db.reviews.toArray(),
    ]);

  // Convert blobs to base64 for JSON serialization
  const metricsWithBase64 = await Promise.all(
    bodyMetrics.map(async (m) => {
      if (m.photoBlob) {
        const buffer = await m.photoBlob.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const type = m.photoBlob.type;
        return { ...m, photoBlob: undefined, photoBase64: base64, photoType: type };
      }
      return m;
    })
  );

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profiles,
    exercises,
    programs,
    programDays,
    workoutSessions,
    setLogs,
    bodyMetrics: metricsWithBase64,
    reviews,
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `muscle-coach-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<void> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (data.version !== 1) {
    throw new Error('Unsupported backup version.');
  }

  // Clear all stores
  await Promise.all([
    db.profiles.clear(),
    db.programs.clear(),
    db.programDays.clear(),
    db.workoutSessions.clear(),
    db.setLogs.clear(),
    db.bodyMetrics.clear(),
    db.reviews.clear(),
  ]);

  // Re-import (don't overwrite exercises seed)
  if (data.profiles?.length) await db.profiles.bulkAdd(data.profiles);
  if (data.programs?.length) await db.programs.bulkAdd(data.programs);
  if (data.programDays?.length) await db.programDays.bulkAdd(data.programDays);
  if (data.workoutSessions?.length) await db.workoutSessions.bulkAdd(data.workoutSessions);
  if (data.setLogs?.length) await db.setLogs.bulkAdd(data.setLogs);
  if (data.reviews?.length) await db.reviews.bulkAdd(data.reviews);

  // Convert base64 photos back to blobs
  if (data.bodyMetrics?.length) {
    const metrics = data.bodyMetrics.map((m: any) => {
      if (m.photoBase64 && m.photoType) {
        const binary = atob(m.photoBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: m.photoType });
        const { photoBase64, photoType, ...rest } = m;
        return { ...rest, photoBlob: blob };
      }
      return m;
    });
    await db.bodyMetrics.bulkAdd(metrics);
  }
}
