import type { WorkoutSession, SetLog, Review, ReviewDecision } from '../db/schema';
import { checkDeload } from './deloadDetector';
import { checkPlateau } from './plateauDetector';

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function sessionCompletionRate(sessions: WorkoutSession[], scheduled: number): string {
  const completed = sessions.filter((s) => s.status === 'completed').length;
  const pct = Math.round((completed / Math.max(scheduled, 1)) * 100);
  return `${completed}/${scheduled} sessions completed (${pct}%)`;
}

export async function generateWeeklyReview(
  sessions: WorkoutSession[],
  allSetLogs: SetLog[],
  scheduledSessionsPerWeek: number,
  targetRIR: number,
  periodStart: Date,
  periodEnd: Date
): Promise<Omit<Review, 'id'>> {
  const sessionLogMap = new Map<number, SetLog[]>();
  for (const log of allSetLogs) {
    if (!sessionLogMap.has(log.workoutSessionId)) {
      sessionLogMap.set(log.workoutSessionId, []);
    }
    sessionLogMap.get(log.workoutSessionId)!.push(log);
  }

  const deload = checkDeload(sessions, sessionLogMap, targetRIR);

  // Per-exercise plateau checks
  const exerciseIds = [...new Set(allSetLogs.map((l) => l.exerciseId))];
  const plateauExerciseIds: number[] = [];

  for (const exId of exerciseIds) {
    const exSessions = sessions
      .filter((s) => s.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((s) =>
        (sessionLogMap.get(s.id!) ?? []).filter((l) => l.exerciseId === exId)
      )
      .filter((arr) => arr.length > 0);

    const result = checkPlateau(exId, exSessions);
    if (result.isPlateau) plateauExerciseIds.push(exId);
  }

  const painLogs = allSetLogs.filter((l) => l.painFlag);
  const painCount = painLogs.length;

  const completionSummary = sessionCompletionRate(
    sessions,
    scheduledSessionsPerWeek
  );

  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const roughCount = sessions.filter((s) => s.sessionFeel === 'rough').length;

  let recommendation = 'Solid effort this week — stay consistent!';
  if (deload.triggered) {
    recommendation = `Time to recover: ${deload.reason}`;
  } else if (painCount > 0) {
    recommendation = `Pain flagged on ${painCount} set(s). Take a closer look and consider swapping joint-unfriendly exercises.`;
  } else if (plateauExerciseIds.length > 0) {
    recommendation = `${plateauExerciseIds.length} exercise(s) hit a plateau. Try swapping variations or adjusting rest times.`;
  } else if (roughCount >= 2) {
    recommendation = 'Multiple rough sessions noted. Prioritize sleep & recovery before pushing heavier weights.';
  } else if (completedCount < scheduledSessionsPerWeek) {
    recommendation = 'Fell slightly short of session target. Focus on hitting full frequency next week!';
  }

  const summary = `Coach Notes (${formatDate(periodStart)} – ${formatDate(periodEnd)}):
• Adherence: ${completionSummary}.
• Session feel: ${roughCount > 0 ? `${roughCount} rough session(s) logged.` : 'All sessions felt smooth & manageable.'}
${painCount > 0 ? `• ⚠️ Pain flagged on ${painCount} set(s) this week — worth a closer look.` : ''}
${deload.triggered ? '• ⚠️ Deload trigger: ' + deload.reason : ''}
${plateauExerciseIds.length > 0 ? `• 📉 Stalled progress detected on ${plateauExerciseIds.length} movement(s).` : ''}

👉 Recommendation: ${recommendation}`;

  const decisions: ReviewDecision = {
    deloadTriggered: deload.triggered,
    plateauExerciseIds,
    nextPhaseRecommended: false,
    volumeChange: 'maintain',
  };

  return {
    type: 'weekly',
    periodStart: formatDate(periodStart),
    periodEnd: formatDate(periodEnd),
    generatedSummary: summary,
    decisions,
    createdAt: new Date().toISOString(),
  };
}

export async function generateMonthlyReview(
  sessions: WorkoutSession[],
  allSetLogs: SetLog[],
  scheduledSessionsPerWeek: number,
  targetRIR: number,
  periodStart: Date,
  periodEnd: Date
): Promise<Omit<Review, 'id'>> {
  const sessionLogMap = new Map<number, SetLog[]>();
  for (const log of allSetLogs) {
    if (!sessionLogMap.has(log.workoutSessionId)) {
      sessionLogMap.set(log.workoutSessionId, []);
    }
    sessionLogMap.get(log.workoutSessionId)!.push(log);
  }

  const deload = checkDeload(sessions, sessionLogMap, targetRIR);
  const exerciseIds = [...new Set(allSetLogs.map((l) => l.exerciseId))];
  const plateauExerciseIds: number[] = [];

  for (const exId of exerciseIds) {
    const exSessions = sessions
      .filter((s) => s.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((s) =>
        (sessionLogMap.get(s.id!) ?? []).filter((l) => l.exerciseId === exId)
      )
      .filter((arr) => arr.length > 0);
    const result = checkPlateau(exId, exSessions);
    if (result.isPlateau) plateauExerciseIds.push(exId);
  }

  const completedSessions = sessions.filter((s) => s.status === 'completed').length;
  const expectedSessions = scheduledSessionsPerWeek * 4;
  const adherencePct = Math.round((completedSessions / Math.max(expectedSessions, 1)) * 100);
  const painCount = allSetLogs.filter((l) => l.painFlag).length;

  const nextPhaseRecommended = adherencePct >= 75 && !deload.triggered && plateauExerciseIds.length === 0 && painCount === 0;

  // Performance-driven volume adjustment decision
  let volumeChange: 'increase' | 'decrease' | 'maintain' = 'maintain';
  let volumeReasoning = '';

  if (adherencePct >= 80) {
    if (deload.triggered || plateauExerciseIds.length >= 2) {
      volumeChange = 'maintain';
      volumeReasoning = `Great consistency (${adherencePct}%), but ${plateauExerciseIds.length} movements plateaued — keeping volume steady while refreshing exercise variations.`;
    } else if (painCount > 2) {
      volumeChange = 'maintain';
      volumeReasoning = `High adherence (${adherencePct}%), but ${painCount} pain flags were logged. Maintaining current set volume to avoid joint strain.`;
    } else {
      volumeChange = 'increase';
      volumeReasoning = `Excellent adherence (${adherencePct}%) and steady strength overload — ready for a slight volume increase!`;
    }
  } else if (adherencePct < 60 || deload.triggered) {
    volumeChange = 'decrease';
    volumeReasoning = `Adherence was ${adherencePct}% with fatigue flags present — lowering set volume to optimize recovery.`;
  } else {
    volumeChange = 'maintain';
    volumeReasoning = `Steady consistency (${adherencePct}%) — keeping set volume unchanged.`;
  }

  const summary = `Monthly Coaching Report (${formatDate(periodStart)} – ${formatDate(periodEnd)}):
• Adherence: ${completedSessions}/${expectedSessions} workouts completed (${adherencePct}%).
• Fatigue Status: ${deload.triggered ? '⚠️ Deload signals present — recovery period needed.' : 'No major systemic fatigue flags.'}
• Overload Status: ${plateauExerciseIds.length > 0 ? `📉 ${plateauExerciseIds.length} exercise(s) plateaued.` : 'Consistent progressive overload logged across most lifts.'}
${painCount > 0 ? `• Pain Flags: ${painCount} set(s) reported discomfort.` : ''}

💡 Volume Recommendation: ${volumeReasoning}
👉 Next Steps: ${nextPhaseRecommended ? '✅ Excellent work — recommended to advance to Phase 2!' : deload.triggered ? '⚠️ Complete a 1-week deload before starting the next block.' : '🔄 Continue current phase, focusing on execution quality and hitting full session target.'}`;

  const decisions: ReviewDecision = {
    deloadTriggered: deload.triggered,
    plateauExerciseIds,
    nextPhaseRecommended,
    volumeChange,
  };

  return {
    type: 'monthly',
    periodStart: formatDate(periodStart),
    periodEnd: formatDate(periodEnd),
    generatedSummary: summary,
    decisions,
    createdAt: new Date().toISOString(),
  };
}
