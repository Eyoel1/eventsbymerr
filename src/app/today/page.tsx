'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/hooks/useProfile';
import { useActiveProgram, useProgramDays } from '@/lib/hooks/useActiveProgram';
import { useTodaySession, useRecentSessions } from '@/lib/hooks/useToday';
import { useAllExercises, useStreak } from '@/lib/hooks/useProgress';
import { db } from '@/lib/db/db';
import { toISODate, formatDisplayDate } from '@/lib/utils/dateHelpers';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, MuscleBadgeType } from '@/components/ui/Badge';
import { Dumbbell, Flame, Calendar, Sparkles, Play, ArrowRight, Zap, Target, Award } from 'lucide-react';

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
          <h2 className="text-2xl font-black mb-2">No Active Program</h2>
          <p className="text-indigo-100 text-sm mb-6 max-w-xs mx-auto">
            Ready to start building muscle? Generate your personalized evidence-based hypertrophy split in 60 seconds.
          </p>
          <Button variant="amber" size="xl" onClick={() => router.push('/onboarding')} id="today-new-program-btn">
            🚀 Build My Program <ArrowRight size={20} />
          </Button>
        </Card>
      </div>
    );
  }

  // Determine today's program day
  const completedSessions = (recentSessions ?? []).filter(
    (s) => s.status === 'completed' && s.programDayId !== undefined
  );
  
  const lastProgramDayOrder = (() => {
    if (!completedSessions.length) return -1;
    const last = completedSessions[0];
    const lastDay = programDays.find((d) => d.id === last.programDayId);
    return lastDay?.order ?? -1;
  })();

  const nextDayOrder = (lastProgramDayOrder + 1) % programDays.length;
  const nextDay = programDays[nextDayOrder];

  const weekNumber = Math.floor(
    (completedSessions.length) / program.frequencyPerWeek
  ) + 1;

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
        <Card variant="amber" className="glow-amber">
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
          <Card variant="emerald" className="glow-emerald text-center py-8">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
              <Flame size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-black mb-1">Workout Complete! 🎉</h2>
            <p className="text-emerald-100 text-sm font-medium mb-3">{formatDisplayDate(toISODate())}</p>
            <p className="text-xs text-emerald-100/90 max-w-xs mx-auto">
              Progressive overload logged. Recovery is where growth happens.
            </p>
          </Card>
        </motion.div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider text-center mt-2">Next Session Preview:</p>
        <WorkoutDayPreview day={programDays[(nextDayOrder + 1) % programDays.length]} exercises={allExercises} />
      </div>
    );
  }

  return (
    <div className="page-content px-4 flex flex-col gap-5 max-w-lg mx-auto">
      <Header profile={profile} />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="glass" className="text-center py-3">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Phase</p>
          <p className="text-lg font-black text-indigo-400">#{program.phase}</p>
        </Card>
        <Card variant="glass" className="text-center py-3">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Week</p>
          <p className="text-lg font-black text-purple-400">Week {weekNumber}</p>
        </Card>
        <Card variant="glass" className="text-center py-3">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Streak</p>
          <p className="text-lg font-black text-amber-400">🔥 {streak?.current ?? 0}w</p>
        </Card>
      </div>

      {/* Warm-up banner */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <Flame size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="font-bold text-amber-400 text-xs uppercase tracking-wide">Warm-up Reminder</p>
            <p className="text-slate-300 text-xs mt-0.5">5-10 min light cardio + dynamic stretches before 1st heavy set.</p>
          </div>
        </div>
      </Card>

      {/* Main Today Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="elevated" className="border-indigo-500/30 glow-indigo">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="purple" size="sm" className="mb-1">{program.name}</Badge>
              <h2 className="text-2xl font-black text-white">{nextDay.dayLabel}</h2>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">
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
            {starting ? 'Starting…' : <><Play size={22} fill="white" /> Start Today's Workout</>}
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
        <h1 className="text-2xl font-black text-white tracking-tight">{greeting} 💪</h1>
        <p className="text-slate-400 text-xs font-medium">
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
            className="flex items-center gap-3 p-3 bg-slate-900/80 rounded-2xl border border-slate-800"
          >
            <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{exercise.name}</p>
              <p className="text-xs text-slate-400">
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
        <div className="h-8 w-48 bg-slate-800 rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-32 bg-slate-800 rounded-lg animate-pulse" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 bg-slate-800/60 rounded-3xl animate-pulse" />
      ))}
    </div>
  );
}
