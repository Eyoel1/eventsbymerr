'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/hooks/useProfile';
import { useActiveProgram, useProgramDays } from '@/lib/hooks/useActiveProgram';
import { useTodaySession, useRecentSessions } from '@/lib/hooks/useToday';
import { useAllExercises, useStreak } from '@/lib/hooks/useProgress';
import { checkMissedWorkout } from '@/lib/engine/missedWorkoutHandler';
import { db } from '@/lib/db/db';
import { toISODate, formatDisplayDate } from '@/lib/utils/dateHelpers';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, MuscleBadgeType } from '@/components/ui/Badge';
import { Dumbbell, Flame, Sparkles, Play, ArrowRight, Zap, AlertCircle, Check, ShieldAlert } from 'lucide-react';

export default function TodayPage() {
  const router = useRouter();
  const profile = useProfile();
  const program = useActiveProgram();
  const programDays = useProgramDays(program?.id);
  const recentSessions = useRecentSessions(20);
  const todaySession = useTodaySession();
  const allExercises = useAllExercises();
  const streak = useStreak();
  const [starting, setStarting] = useState(false);
  const [dismissMissedNotice, setDismissMissedNotice] = useState(false);

  // Redirect to onboarding if no profile
  useEffect(() => {
    if (profile === null) {
      router.replace('/onboarding');
    }
  }, [profile, router]);

  if (profile === undefined || program === undefined || programDays === undefined || allExercises === undefined) {
    return <LoadingSkeleton />;
  }

  if (profile === null) return null;

  if (program === null || !programDays.length) {
    return (
      <div className="page-content px-4 flex flex-col gap-6 max-w-lg mx-auto">
        <Header profile={profile} />
        <Card variant="hero" className="text-center py-12">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Sparkles size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black mb-2">Ready to Build Muscle?</h2>
          <p className="text-indigo-100 text-sm mb-6 max-w-xs mx-auto font-medium">
            Let's generate your personalized, evidence-based hypertrophy split in 60 seconds.
          </p>
          <Button variant="amber" size="xl" onClick={() => router.push('/onboarding')} id="today-new-program-btn">
            🚀 Generate My Program <ArrowRight size={20} />
          </Button>
        </Card>
      </div>
    );
  }

  const completedSessions = (recentSessions ?? []).filter(
    (s) => s.status === 'completed' && s.programDayId !== undefined
  );

  const lastCompletedDate = completedSessions[0]?.date;
  const missedCheck = checkMissedWorkout(lastCompletedDate);

  const lastProgramDayOrder = (() => {
    if (!completedSessions.length) return -1;
    const last = completedSessions[0];
    const lastDay = programDays.find((d) => d.id === last.programDayId);
    return lastDay?.order ?? -1;
  })();

  const nextDayOrder = (lastProgramDayOrder + 1) % programDays.length;
  const nextDay = programDays[nextDayOrder];

  const weekNumber = Math.floor((completedSessions.length) / program.frequencyPerWeek) + 1;

  const handleStartWorkout = async () => {
    setStarting(true);
    const sessionId = await db.workoutSessions.add({
      programDayId: nextDay.id!,
      date: toISODate(),
      startTime: new Date().toISOString(),
      status: 'in_progress',
      notes: '',
    });
    router.push(`/workout/${sessionId}`);
  };

  if (todaySession?.status === 'in_progress') {
    return (
      <div className="page-content px-4 flex flex-col gap-5 max-w-lg mx-auto">
        <Header profile={profile} />
        <Card variant="amber">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-black/20 rounded-2xl flex items-center justify-center">
              <Zap size={22} className="text-slate-950" />
            </div>
            <div>
              <p className="font-black text-slate-950 text-lg">Workout In Progress!</p>
              <p className="text-slate-900 text-xs font-bold">Pick up right where you left off</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => router.push(`/workout/${todaySession.id}`)}
            id="today-resume-workout-btn"
          >
            ▶ Resume Workout
          </Button>
        </Card>
        <WorkoutDayPreview day={nextDay} exercises={allExercises} />
      </div>
    );
  }

  if (todaySession?.status === 'completed') {
    return (
      <div className="page-content px-4 flex flex-col gap-5 max-w-lg mx-auto">
        <Header profile={profile} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card variant="emerald" className="text-center py-8">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
              <Flame size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-black mb-1">Session Crushed! 🎉</h2>
            <p className="text-emerald-100 text-sm font-medium mb-3">{formatDisplayDate(toISODate())}</p>
            <p className="text-xs text-emerald-100/90 max-w-xs mx-auto font-semibold">
              "Great work logging progressive overload today. Growth happens during recovery!"
            </p>
          </Card>
        </motion.div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-center mt-2">Up Next on Schedule:</p>
        <WorkoutDayPreview day={programDays[(nextDayOrder + 1) % programDays.length]} exercises={allExercises} />
      </div>
    );
  }

  return (
    <div className="page-content px-4 flex flex-col gap-5 max-w-lg mx-auto">
      <Header profile={profile} />

      {/* Missed Workout Coach Notice */}
      {missedCheck.isMissed && !dismissMissedNotice && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/40 text-amber-900 dark:text-amber-200 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert size={24} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-extrabold text-sm text-amber-800 dark:text-amber-300 mb-1">
                  Coach Note: Welcome Back!
                </p>
                <p className="text-xs leading-relaxed font-medium mb-2">
                  {missedCheck.coachMessage} {missedCheck.suggestedAdjustment}
                </p>
                <button
                  onClick={() => setDismissMissedNotice(true)}
                  className="text-xs font-black underline text-amber-700 dark:text-amber-400 hover:opacity-80 cursor-pointer"
                >
                  Got it, thanks Coach
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="default" className="text-center py-3">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">Phase</p>
          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">#{program.phase}</p>
        </Card>
        <Card variant="default" className="text-center py-3">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">Week</p>
          <p className="text-lg font-black text-purple-600 dark:text-purple-400">Week {weekNumber}</p>
        </Card>
        <Card variant="default" className="text-center py-3">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">Streak</p>
          <p className="text-lg font-black text-amber-500">🔥 {streak?.current ?? 0}w</p>
        </Card>
      </div>

      {/* Main Today Focus Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="elevated" className="border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="purple" size="sm" className="mb-1">{program.name}</Badge>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{nextDay.dayLabel}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-0.5">
                {nextDay.exercises.length} Exercises · Target RIR {nextDay.exercises[0]?.targetRIR ?? 2}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Dumbbell size={28} className="text-white" />
            </div>
          </div>

          <WorkoutDayPreview day={nextDay} exercises={allExercises} />

          <Button
            variant="gradient"
            size="xl"
            fullWidth
            onClick={handleStartWorkout}
            disabled={starting}
            className="mt-6 glow-indigo"
            id="today-start-workout-btn"
          >
            {starting ? 'Starting…' : <><Play size={22} fill="white" /> Start Today's Session</>}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}

function Header({ profile }: { profile: any }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="pt-2 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{greeting} 💪</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>
      <Badge variant="info" size="md">
        {profile.weightUnit === 'lb' ? `${Math.round(profile.bodywightKg * 2.20462)} lb` : `${profile.bodywightKg} kg`}
      </Badge>
    </div>
  );
}

function WorkoutDayPreview({ day, exercises }: { day: any; exercises: any[] }) {
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));
  return (
    <div className="flex flex-col gap-2.5">
      {day.exercises.map((ex: any, i: number) => {
        const exercise = exerciseMap.get(ex.exerciseId);
        if (!exercise) return null;
        return (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800"
          >
            <span className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{exercise.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {ex.targetSets} × {ex.targetRepRangeLow}–{ex.targetRepRangeHigh} reps · RIR {ex.targetRIR}
              </p>
            </div>
            <Badge muscle={exercise.primaryMuscle as MuscleBadgeType} variant="muscle" size="sm">
              {exercise.primaryMuscle}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="page-content px-4 flex flex-col gap-4 max-w-lg mx-auto">
      <div className="pt-4 pb-2">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
      ))}
    </div>
  );
}
