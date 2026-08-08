export interface MissedWorkoutCheck {
  isMissed: boolean;
  daysGap: number;
  coachMessage?: string;
  suggestedAdjustment?: string;
}

export function checkMissedWorkout(lastSessionDateIso?: string): MissedWorkoutCheck {
  if (!lastSessionDateIso) {
    return { isMissed: false, daysGap: 0 };
  }

  const lastDate = new Date(lastSessionDateIso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - lastDate.getTime();
  const daysGap = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (daysGap >= 7) {
    return {
      isMissed: true,
      daysGap,
      coachMessage: `Welcome back! It's been ${daysGap} days since your last completed session.`,
      suggestedAdjustment: 'Coach Suggestion: Reduce working weights by ~5-10% today to ease muscle tissue back in safely before ramping back to full load.',
    };
  }

  return { isMissed: false, daysGap };
}
