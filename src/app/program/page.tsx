'use client';
import { motion } from 'framer-motion';
import { useActiveProgram, useProgramDays } from '@/lib/hooks/useActiveProgram';
import { useRecentSessions } from '@/lib/hooks/useToday';
import { useAllExercises } from '@/lib/hooks/useProgress';
import { Card } from '@/components/ui/Card';
import { Badge, MuscleBadgeType } from '@/components/ui/Badge';
import { Calendar, Dumbbell, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useState } from 'react';

const SPLIT_LABELS = {
  full_body: 'Full Body',
  upper_lower: 'Upper/Lower',
  push_pull_legs: 'Push/Pull/Legs',
};

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function ProgramPage() {
  const program = useActiveProgram();
  const programDays = useProgramDays(program?.id);
  const recentSessions = useRecentSessions(50);
  const allExercises = useAllExercises();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  if (!program || !programDays || !allExercises) {
    return (
      <div className="page-content px-4 max-w-lg mx-auto">
        <div className="pt-4 mb-6">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Program Overview</h1>
        </div>
        <Card variant="elevated" className="text-center py-12">
          <Dumbbell size={44} className="text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">No active program. Complete onboarding to generate one.</p>
        </Card>
      </div>
    );
  }

  const exerciseMap = new Map(allExercises.map((e) => [e.id!, e]));
  const completedSessions = (recentSessions ?? []).filter((s) => s.status === 'completed');
  const weekNumber = Math.floor(completedSessions.length / Math.max(program.frequencyPerWeek, 1)) + 1;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const thisWeekSessions = completedSessions.filter((s) => {
    const d = new Date(s.date + 'T00:00:00');
    return d >= startOfWeek && d <= today;
  });

  const sessionsPerDay: Record<number, boolean> = {};
  thisWeekSessions.forEach((s) => {
    const d = new Date(s.date + 'T00:00:00');
    sessionsPerDay[d.getDay()] = true;
  });

  return (
    <div className="page-content px-4 flex flex-col gap-5 max-w-lg mx-auto">
      <div className="pt-2">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Program</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{program.name}</p>
      </div>

      {/* Phase Overview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="hero" className="glow-indigo">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-[10px] font-black uppercase tracking-wider mb-1">COACH DESIGNED SPLIT</p>
              <h2 className="text-2xl font-black mb-2">Phase {program.phase}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  {SPLIT_LABELS[program.splitType]}
                </span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  {program.frequencyPerWeek} Days / Week
                </span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  Week {weekNumber}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Layers size={24} className="text-white" />
            </div>
          </div>
          <p className="text-indigo-100 text-xs mt-4 leading-relaxed font-medium">{program.notes}</p>
        </Card>
      </motion.div>

      {/* Weekly Schedule Strip */}
      <Card variant="elevated">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">This Week's Attendance</h3>
        <div className="flex gap-2">
          {DAY_LABELS.map((label, i) => {
            const isToday = i === today.getDay();
            const hasSession = sessionsPerDay[i];
            return (
              <div
                key={i}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl border transition-all ${
                  isToday
                    ? 'bg-indigo-600 text-white border-indigo-400 glow-indigo'
                    : hasSession
                    ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                <span className="text-[10px] font-black">{label}</span>
                <span className="text-sm font-black">
                  {hasSession ? '✓' : isToday ? '★' : '·'}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Program Days List */}
      <div>
        <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">Interleaved Schedule Breakdown</h3>
        <div className="flex flex-col gap-3">
          {programDays.map((day) => {
            const isExpanded = expandedDay === day.id;
            return (
              <Card key={day.id} variant="default">
                <button
                  className="flex items-center gap-3.5 w-full text-left cursor-pointer"
                  onClick={() => setExpandedDay(isExpanded ? null : day.id!)}
                  id={`program-day-${day.id}`}
                >
                  <div className="w-11 h-11 bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 dark:text-white text-base truncate">{day.dayLabel}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{day.exercises.length} Movements</p>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80 pt-4"
                  >
                    <div className="flex flex-col gap-2.5">
                      {day.exercises.map((ex, i) => {
                        const exercise = exerciseMap.get(ex.exerciseId);
                        if (!exercise) return null;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"
                          >
                            <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{exercise.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {ex.targetSets}× {ex.targetRepRangeLow}–{ex.targetRepRangeHigh} reps · RIR {ex.targetRIR} · Rest {Math.floor(ex.restSeconds / 60)}m
                              </p>
                            </div>
                            <Badge muscle={exercise.primaryMuscle as MuscleBadgeType} variant="muscle" size="sm">
                              {exercise.primaryMuscle}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
