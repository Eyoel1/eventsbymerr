'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Profile } from '../db/schema';

export function useProfile() {
  const profile = useLiveQuery(async () => {
    const p = await db.profiles.toCollection().first();
    return p ?? null;
  });
  return profile;
}

export async function saveProfile(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Profile, 'id' | 'createdAt' | 'updatedAt'>>) {
  const now = new Date().toISOString();
  const existing = await db.profiles.toCollection().first();
  if (existing) {
    await db.profiles.update(existing.id!, { ...data, updatedAt: now });
    return existing.id!;
  } else {
    return db.profiles.add({ ...data, createdAt: now, updatedAt: now } as Profile);
  }
}
