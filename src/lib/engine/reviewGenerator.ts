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

  const completionSummary = sessionCompletionRate(
    sessions,
    scheduledSessionsPerWeek
  );

  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const roughCount = sessions.filter((s) => s.sessionFeel === 'rough').length;

  let recommendation = 'Continue as planned — solid week.';
  if (deload.triggered) {
    recommendation = `Deload recommended: ${deload.reason}`;
  } else if (plateauExerciseIds.length > 0) {
    recommendation = `${plateauExerciseIds.length} exercise(s) showing plateau signs. See exercise cards for suggestions.`;
  } else if (roughCount >= 2) {
    recommendation = 'Multiple rough sessions noted. Monitor fatigue closely next week.';
  } else if (completedCount < scheduledSessionsPerWeek) {
    recommendation = 'Below target sessions this week. Aim for full completion next week.';
  }

  const summary = `Week ${formatDate(periodStart)} to ${formatDate(periodEnd)}.
${completionSummary}.
${roughCount > 0 ? `${roughCount} session(s) felt rough.` : 'All sessions felt manageable.'}
${deload.triggered ? '⚠️ Deload flag: ' + deload.reason : ''}
${plateauExerciseIds.length > 0 ? `📉 Plateau detected on ${plateauExerciseIds.length} exercise(s).` : ''}
Recommendation: ${recommendation}`;

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

  const nextPhaseRecommended = adherencePct >= 75 && !deload.triggered && plateauExerciseIds.length === 0;

  const volumeChange = adherencePct >= 80 ? 'increase' : adherencePct < 60 ? 'decrease' : 'maintain';

  const summary = `Monthly Review: ${formatDate(periodStart)} to ${formatDate(periodEnd)}.
Adherence: ${completedSessions}/${expectedSessions} sessions (${adherencePct}%).
${deload.triggered ? '⚠️ Fatigue flags detected — deload before next phase.' : 'No major fatigue flags.'}
${plateauExerciseIds.length > 0 ? `📉 ${plateauExerciseIds.length} exercise(s) plateaued — consider variations in Phase 2.` : 'Progressive overload achieved across most exercises.'}
Recommendation: ${nextPhaseRecommended ? '✅ Ready for Phase 2 — consider increasing volume or exercise difficulty.' : deload.triggered ? '⚠️ Complete deload week before starting Phase 2.' : '🔄 Continue Phase 1 for another 2-4 weeks, focusing on consistency.'}`;

  const decisions: ReviewDecision = {
    deloadTriggered: deload.triggered,
    plateauExerciseIds,
    nextPhaseRecommended,
    volumeChange: volumeChange as 'increase' | 'decrease' | 'maintain',
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
