'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useActiveProgram() {
  return useLiveQuery(async () => {
    const prog = await db.programs.where('status').equals('active').first();
    return prog ?? null;
  });
}

export function useProgramDays(programId?: number) {
  return useLiveQuery(() => {
    if (!programId) return [];
    return db.programDays.where('programId').equals(programId).sortBy('order');
  }, [programId]);
}
