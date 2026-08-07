'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useBodyMetrics() {
  return useLiveQuery(() =>
    db.bodyMetrics.orderBy('date').toArray()
  );
}

export function useExerciseSetLogs(exerciseId?: number) {
  return useLiveQuery(() => {
    if (!exerciseId) return [];
    return db.setLogs
      .where('exerciseId')
      .equals(exerciseId)
      .sortBy('createdAt');
  }, [exerciseId]);
}

export function useAllExercises() {
  return useLiveQuery(() => db.exercises.toArray());
}

export function useStreak() {
  return useLiveQuery(async () => {
    const sessions = await db.workoutSessions
      .where('status')
      .equals('completed')
      .sortBy('date');
    
    if (!sessions.length) return { current: 0, longest: 0, thisMonth: 0 };
    
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    
    const thisMonthCount = sessions.filter(s => {
      const d = new Date(s.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    // Streak = consecutive weeks with at least 1 session
    let streak = 0;
    const weekSet = new Set<string>();
    sessions.forEach(s => {
      const d = new Date(s.date + 'T00:00:00');
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      weekSet.add(weekStart.toISOString().split('T')[0]);
    });
    
    const weeks = [...weekSet].sort().reverse();
    if (weeks.length === 0) return { current: 0, longest: 0, thisMonth: thisMonthCount };
    
    const currentWeekStart = new Date();
    currentWeekStart.setDate(today.getDate() - today.getDay());
    const cwStr = currentWeekStart.toISOString().split('T')[0];
    
    for (let i = 0; i < weeks.length; i++) {
      const expected = new Date(cwStr);
      expected.setDate(expected.getDate() - i * 7);
      const expectedStr = expected.toISOString().split('T')[0];
      if (weeks[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    return { current: streak, longest: Math.max(...Array.from({ length: streak }, (_, i) => i + 1), 0), thisMonth: thisMonthCount };
  });
}
