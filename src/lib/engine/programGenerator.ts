import { db } from '../db/db';
import type { Profile, Program, ProgramDay, ProgramDayExercise, Exercise, SplitType } from '../db/schema';

// Equipment hierarchy for fallback substitution
const EQUIPMENT_PRIORITY: Record<string, number> = {
  machine: 0,
  cable: 1,
  barbell: 2,
  dumbbell: 3,
  bodyweight: 4,
  kettlebell: 5,
  resistance_band: 6,
};

function pickSplit(daysPerWeek: number): SplitType {
  if (daysPerWeek <= 3) return 'full_body';
  if (daysPerWeek === 4) return 'upper_lower';
  return 'push_pull_legs';
}

function filterExercises(
  exercises: Exercise[],
  equipment: string[],
  excludeIds: number[]
): Exercise[] {
  return exercises.filter(
    (ex) =>
      equipment.includes(ex.equipment) &&
      !excludeIds.includes(ex.id!)
  );
}

function pickExercises(
  pool: Exercise[],
  muscle: string,
  count: number
): Exercise[] {
  const matching = pool
    .filter((ex) => ex.primaryMuscle === muscle)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  return matching;
}

function makeProgramDayExercise(
  ex: Exercise,
  order: number,
  isCompound: boolean
): ProgramDayExercise {
  const compoundSets = 3;
  const isolationSets = 3;
  const sets = isCompound ? compoundSets : isolationSets;

  return {
    exerciseId: ex.id!,
    targetSets: sets,
    targetRepRangeLow: isCompound ? 6 : 10,
    targetRepRangeHigh: isCompound ? 10 : 15,
    targetRIR: 2,
    restSeconds: isCompound ? 150 : 90,
    order,
  };
}

const COMPOUND_MUSCLES = new Set([
  'chest', 'back', 'quads', 'hamstrings', 'glutes',
]);

export async function generateProgram(profile: Profile): Promise<void> {
  const allExercises = await db.exercises.toArray();
  const availableExercises = filterExercises(
    allExercises,
    profile.equipmentAccess,
    profile.dislikedExerciseIds
  );

  const splitType = pickSplit(profile.trainingDaysPerWeek);
  const days = profile.trainingDaysPerWeek;

  const program: Program = {
    name: `Phase 1 – ${splitType === 'full_body' ? 'Full Body' : splitType === 'upper_lower' ? 'Upper/Lower' : 'PPL'}`,
    phase: 1,
    startDate: new Date().toISOString().split('T')[0],
    status: 'active',
    frequencyPerWeek: days,
    splitType,
    notes: `Auto-generated Phase 1 program. ${splitType === 'full_body' ? 'Full body 3x/week — ideal for beginners to maximize practice frequency.' : splitType === 'upper_lower' ? 'Upper/Lower 4x/week — each muscle trained 2x per week.' : 'Push/Pull/Legs 5-6x/week — higher frequency split.'}`,
  };

  const programId = await db.programs.add(program);

  const programDays: Omit<ProgramDay, 'id'>[] = [];

  if (splitType === 'full_body') {
    // Full body A/B alternating
    for (let i = 0; i < days; i++) {
      const isA = i % 2 === 0;
      const label = isA ? `Day ${i + 1} – Full Body A` : `Day ${i + 1} – Full Body B`;
      const exercises: ProgramDayExercise[] = [];
      let order = 0;

      // Squat pattern
      const squatPool = pickExercises(availableExercises, 'quads', isA ? 1 : 1);
      squatPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      // Hip hinge
      const hingePool = pickExercises(availableExercises, isA ? 'hamstrings' : 'glutes', 1);
      hingePool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      // Push (chest/shoulders)
      const pushPool = pickExercises(availableExercises, isA ? 'chest' : 'shoulders', 1);
      pushPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      // Pull (back)
      const pullPool = pickExercises(availableExercises, 'back', 1);
      pullPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      // Isolation accessories
      const biPool = pickExercises(availableExercises, 'biceps', 1);
      biPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));

      const triPool = pickExercises(availableExercises, 'triceps', 1);
      triPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));

      const corePool = pickExercises(availableExercises, 'core', 1);
      corePool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));

      programDays.push({ programId: programId as number, dayLabel: label, exercises, order: i });
    }
  } else if (splitType === 'upper_lower') {
    const upperDays = Math.ceil(days / 2);
    const lowerDays = days - upperDays;

    const rawUpperDays: Omit<ProgramDay, 'id'>[] = [];
    const rawLowerDays: Omit<ProgramDay, 'id'>[] = [];

    for (let i = 0; i < upperDays; i++) {
      const isA = i % 2 === 0;
      const exercises: ProgramDayExercise[] = [];
      let order = 0;

      const chestPool = pickExercises(availableExercises, 'chest', 1);
      chestPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      const backPool = pickExercises(availableExercises, 'back', 1);
      backPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      const shoulderPool = pickExercises(availableExercises, 'shoulders', 1);
      shoulderPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      const biPool = pickExercises(availableExercises, 'biceps', 1);
      biPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));

      const triPool = pickExercises(availableExercises, 'triceps', 1);
      triPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));

      if (isA) {
        const shoulderExtra = pickExercises(availableExercises, 'shoulders', 1);
        shoulderExtra.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));
      }

      rawUpperDays.push({
        programId: programId as number,
        dayLabel: `Upper ${isA ? 'A' : 'B'}`,
        exercises,
        order: 0,
      });
    }

    for (let i = 0; i < lowerDays; i++) {
      const isA = i % 2 === 0;
      const exercises: ProgramDayExercise[] = [];
      let order = 0;

      const quadPool = pickExercises(availableExercises, 'quads', 1);
      quadPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      const hamPool = pickExercises(availableExercises, 'hamstrings', 1);
      hamPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      const glutePool = pickExercises(availableExercises, 'glutes', 1);
      glutePool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));

      const calfPool = pickExercises(availableExercises, 'calves', 1);
      calfPool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));

      const corePool = pickExercises(availableExercises, 'core', 1);
      corePool.forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));

      rawLowerDays.push({
        programId: programId as number,
        dayLabel: `Lower ${isA ? 'A' : 'B'}`,
        exercises,
        order: 0,
      });
    }

    // Interleave upper and lower days: Upper A -> Lower A -> Upper B -> Lower B
    let orderIndex = 0;
    const maxLen = Math.max(rawUpperDays.length, rawLowerDays.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < rawUpperDays.length) {
        programDays.push({ ...rawUpperDays[i], order: orderIndex++ });
      }
      if (i < rawLowerDays.length) {
        programDays.push({ ...rawLowerDays[i], order: orderIndex++ });
      }
    }
  } else {
    // PPL Split
    const labels = ['Push', 'Pull', 'Legs'];
    for (let i = 0; i < days; i++) {
      const labelType = labels[i % 3];
      const exercises: ProgramDayExercise[] = [];
      let order = 0;
      if (labelType === 'Push') {
        pickExercises(availableExercises, 'chest', 2).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));
        pickExercises(availableExercises, 'shoulders', 1).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));
        pickExercises(availableExercises, 'triceps', 2).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));
      } else if (labelType === 'Pull') {
        pickExercises(availableExercises, 'back', 2).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));
        pickExercises(availableExercises, 'shoulders', 1).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));
        pickExercises(availableExercises, 'biceps', 2).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));
      } else {
        pickExercises(availableExercises, 'quads', 2).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));
        pickExercises(availableExercises, 'hamstrings', 1).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, true)));
        pickExercises(availableExercises, 'calves', 1).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));
        pickExercises(availableExercises, 'core', 1).forEach(ex => exercises.push(makeProgramDayExercise(ex, order++, false)));
      }
      programDays.push({
        programId: programId as number,
        dayLabel: `Day ${i + 1} – ${labelType}`,
        exercises,
        order: i,
      });
    }
  }
  await db.programDays.bulkAdd(programDays as ProgramDay[]);
}
