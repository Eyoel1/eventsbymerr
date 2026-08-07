export function toISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round(Math.abs((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24)));
}

export function startOfWeek(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return toISODate(d);
}

export function weekNumber(isoDate: string): number {
  const d = new Date(isoDate + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function getWeekDates(weekStartIso: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartIso, i));
}
