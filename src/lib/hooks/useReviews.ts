'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useReviews(limit = 20) {
  return useLiveQuery(() =>
    db.reviews.orderBy('periodStart').reverse().limit(limit).toArray()
  );
}

export function useLatestWeeklyReview() {
  return useLiveQuery(() =>
    db.reviews.where('type').equals('weekly').reverse().first()
  );
}

export function useLatestMonthlyReview() {
  return useLiveQuery(() =>
    db.reviews.where('type').equals('monthly').reverse().first()
  );
}
