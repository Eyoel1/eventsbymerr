import type { SetLog } from '../db/schema';

export interface PlateauResult {
  isPlateau: boolean;
  exerciseId: number;
  reason: string;
  suggestion: string;
}

export function checkPlateau(
  exerciseId: number,
  sessionLogs: SetLog[][], // Array of sessions (most recent first), each is all sets for this exercise
  requiredSessions: number = 3
): PlateauResult {
  const noResult: PlateauResult = {
    isPlateau: false,
    exerciseId,
    reason: '',
    suggestion: '',
  };

  if (sessionLogs.length < requiredSessions) return noResult;

  const last3 = sessionLogs.slice(0, requiredSessions);

  // Check if all sessions had RIR <= 2 (user is training hard)
  const allHardEffort = last3.every((session) => {
    const avgRIR = session.reduce((s, l) => s + l.rir, 0) / (session.length || 1);
    return avgRIR <= 2;
  });

  if (!allHardEffort) return noResult;

  // Check for no weight progression
  const topWeights = last3.map((session) =>
    Math.max(...session.map((s) => s.weightKg))
  );
  const noWeightIncrease =
    topWeights[0] <= topWeights[requiredSessions - 1] &&
    topWeights[0] === topWeights[1];

  // Check for no rep progression
  const topReps = last3.map((session) =>
    Math.max(...session.map((s) => s.reps))
  );
  const noRepIncrease =
    topReps[0] <= topReps[requiredSessions - 1] &&
    topReps[0] === topReps[1];

  if (noWeightIncrease && noRepIncrease) {
    return {
      isPlateau: true,
      exerciseId,
      reason: `No weight or rep increase over the last ${requiredSessions} sessions despite training hard (RIR ≤ 2).`,
      suggestion:
        'Consider: (1) Swapping to a variation to refresh stimulus, (2) Adding one set, (3) Adjusting rep range, or (4) Checking consistency and technique. Avoid increasing weight without rep range improvement.',
    };
  }

  return noResult;
}
