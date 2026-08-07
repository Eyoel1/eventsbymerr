import type { WorkoutSession, SetLog } from '../db/schema';

export interface DeloadResult {
  triggered: boolean;
  reason: string;
}

export function checkDeload(
  recentSessions: WorkoutSession[],
  sessionSetLogs: Map<number, SetLog[]>, // sessionId -> all set logs
  targetRIR: number // program-level target RIR
): DeloadResult {
  const sortedSessions = [...recentSessions]
    .filter((s) => s.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Rule 1: 3+ consecutive 'rough' sessions
  const roughStreak = sortedSessions
    .slice(0, 3)
    .filter((s) => s.sessionFeel === 'rough').length;
  if (roughStreak >= 3) {
    return {
      triggered: true,
      reason: 'You have rated 3 consecutive sessions as "Rough". Your body is signalling accumulated fatigue — a deload is recommended.',
    };
  }

  // Rule 2: Performance regression on 2+ exercises across 2 consecutive sessions
  if (sortedSessions.length >= 2) {
    const sess0 = sessionSetLogs.get(sortedSessions[0].id!) ?? [];
    const sess1 = sessionSetLogs.get(sortedSessions[1].id!) ?? [];

    const getExerciseIds = (logs: SetLog[]) =>
      [...new Set(logs.map((l) => l.exerciseId))];

    const ids0 = new Set(getExerciseIds(sess0));
    const ids1 = new Set(getExerciseIds(sess1));
    const sharedIds = [...ids0].filter((id) => ids1.has(id));

    let regressionCount = 0;
    for (const exId of sharedIds) {
      const sets0 = sess0.filter((l) => l.exerciseId === exId);
      const sets1 = sess1.filter((l) => l.exerciseId === exId);
      const maxReps0 = Math.max(...sets0.map((s) => s.reps), 0);
      const maxReps1 = Math.max(...sets1.map((s) => s.reps), 0);
      const maxWeight0 = Math.max(...sets0.map((s) => s.weightKg), 0);
      const maxWeight1 = Math.max(...sets1.map((s) => s.weightKg), 0);
      if (maxWeight0 < maxWeight1 || maxReps0 < maxReps1 - 2) {
        regressionCount++;
      }
    }
    if (regressionCount >= 2) {
      return {
        triggered: true,
        reason: `Performance dropped on ${regressionCount} exercises across your last 2 sessions. Consider a deload to allow recovery.`,
      };
    }
  }

  // Rule 3: RIR consistently below target for 5+ consecutive sessions
  const last5 = sortedSessions.slice(0, 5);
  if (last5.length >= 5) {
    const allBelowTargetRIR = last5.every((sess) => {
      const logs = sessionSetLogs.get(sess.id!) ?? [];
      if (!logs.length) return false;
      const avgRIR = logs.reduce((s, l) => s + l.rir, 0) / logs.length;
      return avgRIR < targetRIR - 1;
    });
    if (allBelowTargetRIR) {
      return {
        triggered: true,
        reason: `Your reported RIR has been consistently below the target (${targetRIR}) for 5+ sessions. You are likely accumulating more fatigue than recovering from.`,
      };
    }
  }

  return { triggered: false, reason: '' };
}
