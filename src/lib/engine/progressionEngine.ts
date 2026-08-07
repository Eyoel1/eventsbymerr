import type { SetLog, ProgramDayExercise } from '../db/schema';

export type ProgressionDecision =
  | 'increase_weight'
  | 'maintain_weight_add_reps'
  | 'maintain'
  | 'ready_to_progress_early'
  | 'regression';

export interface WeightSuggestion {
  suggestedWeightKg: number;
  suggestedReps: number;
  decision: ProgressionDecision;
  reasoning: string;
}

function getIncrement(weightIncrementKg: number): number {
  return weightIncrementKg || 2.5;
}

function avgRIR(sets: SetLog[]): number {
  if (!sets.length) return 3;
  return sets.reduce((s, l) => s + l.rir, 0) / sets.length;
}

function allHitTopOfRange(sets: SetLog[], target: ProgramDayExercise): boolean {
  const workingSets = sets.slice(0, target.targetSets);
  return workingSets.every(
    (s) => s.reps >= target.targetRepRangeHigh && s.rir <= target.targetRIR
  );
}

function anyMissedBottomOfRange(sets: SetLog[], target: ProgramDayExercise): boolean {
  const workingSets = sets.slice(0, target.targetSets);
  return workingSets.some((s) => s.reps < target.targetRepRangeLow);
}

export function calculateWeightSuggestion(
  target: ProgramDayExercise,
  recentSessions: SetLog[][], // most recent first, each element = all sets for that exercise in one session
  weightIncrementKg: number,
  currentWeightKg?: number
): WeightSuggestion {
  if (recentSessions.length === 0 || !currentWeightKg) {
    return {
      suggestedWeightKg: 0,
      suggestedReps: target.targetRepRangeLow,
      decision: 'maintain',
      reasoning: 'No previous data. Start with a comfortable weight and note it.',
    };
  }

  const lastSession = recentSessions[0];
  const lastWeight = lastSession[0]?.weightKg ?? currentWeightKg;
  const increment = getIncrement(weightIncrementKg);
  const avg = avgRIR(lastSession);

  // Regression check
  if (recentSessions.length >= 2) {
    const missed1 = anyMissedBottomOfRange(recentSessions[0], target);
    const missed2 = anyMissedBottomOfRange(recentSessions[1], target);
    if (missed1 && missed2) {
      return {
        suggestedWeightKg: Math.max(0, lastWeight - increment),
        suggestedReps: target.targetRepRangeLow,
        decision: 'regression',
        reasoning: `Missed reps on last 2 sessions. Dropping weight by ${increment}kg to rebuild.`,
      };
    }
  }

  // Ready to progress early (RIR much higher than target)
  if (avg > target.targetRIR + 2) {
    return {
      suggestedWeightKg: lastWeight + increment,
      suggestedReps: target.targetRepRangeLow,
      decision: 'ready_to_progress_early',
      reasoning: `Average RIR was ${avg.toFixed(1)} vs target ${target.targetRIR} — weight feels easy. Increasing early.`,
    };
  }

  // Standard double progression
  if (allHitTopOfRange(lastSession, target)) {
    return {
      suggestedWeightKg: lastWeight + increment,
      suggestedReps: target.targetRepRangeLow,
      decision: 'increase_weight',
      reasoning: `Hit ${target.targetRepRangeHigh} reps on all sets at or below RIR ${target.targetRIR}. Increasing by ${increment}kg.`,
    };
  }

  if (anyMissedBottomOfRange(lastSession, target)) {
    return {
      suggestedWeightKg: lastWeight,
      suggestedReps: target.targetRepRangeLow,
      decision: 'maintain_weight_add_reps',
      reasoning: 'Did not hit the bottom of the rep range last session. Maintain weight, focus on adding reps.',
    };
  }

  return {
    suggestedWeightKg: lastWeight,
    suggestedReps: target.targetRepRangeLow,
    decision: 'maintain',
    reasoning: 'Performance within target range. Maintain weight and aim to add reps or improve RIR.',
  };
}
