import Dexie, { type Table } from 'dexie';
import type {
  Profile,
  Exercise,
  Program,
  ProgramDay,
  WorkoutSession,
  SetLog,
  BodyMetric,
  Review,
} from './schema';

export class MuscleCoachDB extends Dexie {
  profiles!: Table<Profile>;
  exercises!: Table<Exercise>;
  programs!: Table<Program>;
  programDays!: Table<ProgramDay>;
  workoutSessions!: Table<WorkoutSession>;
  setLogs!: Table<SetLog>;
  bodyMetrics!: Table<BodyMetric>;
  reviews!: Table<Review>;

  constructor() {
    super('MuscleCoachDB');
    this.version(1).stores({
      profiles: '++id',
      exercises: '++id, slug, primaryMuscle, equipment, difficultyTier',
      programs: '++id, status',
      programDays: '++id, programId, order',
      workoutSessions: '++id, programDayId, date, status',
      setLogs: '++id, workoutSessionId, exerciseId, createdAt',
      bodyMetrics: '++id, date',
      reviews: '++id, type, periodStart',
    });
  }
}

export const db = new MuscleCoachDB();
