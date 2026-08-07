'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { toISODate } from '../utils/dateHelpers';

export function useTodaySession() {
  const today = toISODate();
  return useLiveQuery(async () => {
    const s = await db.workoutSessions.where('date').equals(today).first();
    return s ?? null;
  }, [today]);
}

export function useRecentSessions(limit = 10) {
  return useLiveQuery(() =>
    db.workoutSessions
      .orderBy('date')
      .reverse()
      .limit(limit)
      .toArray()
  );
}

export function useSessionSetLogs(sessionId?: number) {
  return useLiveQuery(() => {
    if (!sessionId) return [];
    return db.setLogs.where('workoutSessionId').equals(sessionId).toArray();
  }, [sessionId]);
}
