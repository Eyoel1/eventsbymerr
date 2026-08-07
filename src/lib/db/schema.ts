// All TypeScript interfaces for IndexedDB stores

export type Sex = 'male' | 'female' | 'other';
export type ExperienceLevel = 'beginner' | 'some_experience' | 'intermediate';
export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance_band';
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'biceps'
  | 'triceps'
  | 'core';
export type SplitType = 'full_body' | 'upper_lower' | 'push_pull_legs';
export type ProgramStatus = 'active' | 'completed' | 'paused';
export type SessionStatus = 'in_progress' | 'completed' | 'skipped';
export type DifficultyTier = 'beginner' | 'intermediate';
export type SessionFeel = 'great' | 'ok' | 'rough';
export type ReviewType = 'weekly' | 'monthly';
export type WeightUnit = 'kg' | 'lb';

export interface Profile {
  id?: number;
  age: number;
  sex: Sex;
  heightCm: number;
  bodywightKg: number;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  maxSessionMinutes: number;
  equipmentAccess: Equipment[];
  injuryLimitations: string; // free text
  dislikedExerciseIds: number[];
  goal: 'hypertrophy'; // v1 only supports hypertrophy
  weightUnit: WeightUnit;
  darkMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id?: number;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficultyTier: DifficultyTier;
  substituteIds: number[];
  techniqueNotes: {
    setup: string;
    execution: string;
    commonMistakes: string;
    breathingCues: string;
  };
  weightIncrementKg: number; // smallest sensible increment
}

export interface ProgramDayExercise {
  exerciseId: number;
  targetSets: number;
  targetRepRangeLow: number;
  targetRepRangeHigh: number;
  targetRIR: number;
  restSeconds: number;
  order: number;
}

export interface ProgramDay {
  id?: number;
  programId: number;
  dayLabel: string; // e.g. "Day 1 – Push"
  dayOfWeek?: number[]; // 0=Sun … 6=Sat, optional scheduling hint
  exercises: ProgramDayExercise[];
  order: number;
}

export interface Program {
  id?: number;
  name: string;
  phase: number;
  startDate: string;
  status: ProgramStatus;
  frequencyPerWeek: number;
  splitType: SplitType;
  notes: string;
}

export interface WorkoutSession {
  id?: number;
  programDayId?: number;
  date: string; // ISO date string YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  status: SessionStatus;
  sessionFeel?: SessionFeel;
  notes: string;
}

export interface SetLog {
  id?: number;
  workoutSessionId: number;
  exerciseId: number;
  setNumber: number;
  weightKg: number;
  reps: number;
  rir: number;
  painFlag: boolean;
  painNote?: string;
  createdAt: string;
}

export interface BodyMetric {
  id?: number;
  date: string;
  bodyweightKg: number;
  photoBlob?: Blob;
  notes: string;
}

export interface ReviewDecision {
  frequencyChange?: number; // delta days
  volumeChange?: string; // 'increase' | 'decrease' | 'maintain'
  deloadTriggered: boolean;
  plateauExerciseIds: number[];
  nextPhaseRecommended: boolean;
}

export interface Review {
  id?: number;
  type: ReviewType;
  periodStart: string;
  periodEnd: string;
  generatedSummary: string;
  decisions: ReviewDecision;
  createdAt: string;
}
