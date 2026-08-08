'use client';
import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAllExercises } from '@/lib/hooks/useProgress';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge, MuscleBadgeType } from '@/components/ui/Badge';
import type { SetLog, ProgramDayExercise, Exercise } from '@/lib/db/schema';
import { Check, ChevronDown, ChevronUp, RefreshCw, AlertTriangle, X, Info, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function WorkoutPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId: sessionIdStr } = use(params);
  const sessionId = parseInt(sessionIdStr);
  const router = useRouter();

  const session = useLiveQuery(() => db.workoutSessions.get(sessionId), [sessionId]);
  const programDay = useLiveQuery(async () => {
    if (!session?.programDayId) return undefined;
    return db.programDays.get(session.programDayId);
  }, [session?.programDayId]);
  const setLogs = useLiveQuery(
    () => db.setLogs.where('workoutSessionId').equals(sessionId).toArray(),
    [sessionId]
  );
  const allExercises = useAllExercises();

  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [swapModal, setSwapModal] = useState<{ exercise: Exercise; target: ProgramDayExercise } | null>(null);
  const [techniqueModal, setTechniqueModal] = useState<Exercise | null>(null);
  const [finishModal, setFinishModal] = useState(false);
  const [sessionFeel, setSessionFeel] = useState<'great' | 'ok' | 'rough'>('ok');
  const [overrides, setOverrides] = useState<Record<number, number>>({});

  useEffect(() => {
    if (programDay?.exercises?.[0]) {
      setExpandedExercise(programDay.exercises[0].exerciseId);
    }
  }, [programDay]);

  if (!session || !programDay || !setLogs || !allExercises) {
    return (
      <div className="page-content px-4 flex items-center justify-center min-h-dvh">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full glow-indigo" />
      </div>
    );
  }

  const exerciseMap = new Map(allExercises.map((e) => [e.id!, e]));

  const handleLogSet = async (
    target: ProgramDayExercise,
    weight: number,
    reps: number,
    rir: number,
    painFlag: boolean,
    painNote?: string
  ) => {
    const effectiveExId = overrides[target.exerciseId] ?? target.exerciseId;
    const existingSets = setLogs.filter(
      (l) => l.exerciseId === effectiveExId
    ).length;
    await db.setLogs.add({
      workoutSessionId: sessionId,
      exerciseId: effectiveExId,
      setNumber: existingSets + 1,
      weightKg: weight,
      reps,
      rir,
      painFlag,
      painNote: painNote ?? '',
      createdAt: new Date().toISOString(),
    });
  };

  const handleFinish = async () => {
    await db.workoutSessions.update(sessionId, {
      status: 'completed',
      endTime: new Date().toISOString(),
      sessionFeel,
    });
    router.replace('/today');
  };

  const totalSetsLogged = setLogs.length;
  const totalSetsTarget = programDay.exercises.reduce(
    (s: number, e: ProgramDayExercise) => s + e.targetSets,
    0
  );
  const progress = Math.min(totalSetsLogged / Math.max(totalSetsTarget, 1), 1);

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-nav px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Back">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black text-slate-900 dark:text-white truncate">{programDay.dayLabel}</h1>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{totalSetsLogged} / {totalSetsTarget} Sets Logged</p>
          </div>
          <Button
            variant="success"
            size="sm"
            onClick={() => setFinishModal(true)}
            id="workout-finish-btn"
            className="glow-emerald"
          >
            Finish
          </Button>
        </div>
        {/* Progress Bar */}
        <div className="mt-2.5 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4 pb-28 max-w-lg mx-auto">
        {programDay.exercises.map((target) => {
          const effectiveExId = overrides[target.exerciseId] ?? target.exerciseId;
          const exercise = exerciseMap.get(effectiveExId);
          if (!exercise) return null;
          const isSwapped = overrides[target.exerciseId] !== undefined;
          const exerciseSets = setLogs.filter((l) => l.exerciseId === effectiveExId);
          const isExpanded = expandedExercise === target.exerciseId;

          return (
            <ExerciseCard
              key={target.exerciseId}
              target={target}
              exercise={exercise}
              isSwapped={isSwapped}
              exerciseSets={exerciseSets}
              isExpanded={isExpanded}
              onToggle={() => setExpandedExercise(isExpanded ? null : target.exerciseId)}
              onLogSet={handleLogSet}
              onSwap={() => setSwapModal({ exercise, target })}
              onTechnique={() => setTechniqueModal(exercise)}
            />
          );
        })}
      </div>

      {/* Swap Modal */}
      <Modal open={!!swapModal} onClose={() => setSwapModal(null)} title={`Swap: ${swapModal?.exercise.name}`}>
        {swapModal && (
          <SwapModalContent
            target={swapModal.target}
            exerciseMap={exerciseMap}
            onSwap={(newId) => {
              setOverrides((o) => ({ ...o, [swapModal.target.exerciseId]: newId }));
              setSwapModal(null);
            }}
          />
        )}
      </Modal>

      {/* Technique Modal */}
      <Modal open={!!techniqueModal} onClose={() => setTechniqueModal(null)} title={techniqueModal?.name}>
        {techniqueModal && <TechniqueContent exercise={techniqueModal} />}
      </Modal>

      {/* Finish Modal */}
      <Modal open={finishModal} onClose={() => setFinishModal(false)} title="Finish Session">
        <div className="flex flex-col gap-5">
          <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold text-center">How did that session feel?</p>
          <div className="flex gap-2">
            {[
              { value: 'great', label: '🔥 Great', bg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40' },
              { value: 'ok', label: '👍 OK', bg: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-500/40' },
              { value: 'rough', label: '😓 Rough', bg: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40' },
            ].map(({ value, label, bg }) => (
              <button
                key={value}
                id={`finish-feel-${value}`}
                onClick={() => setSessionFeel(value as any)}
                className={`flex-1 py-3.5 rounded-2xl font-black text-sm border-2 transition-all cursor-pointer ${
                  sessionFeel === value ? bg : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button variant="success" size="lg" fullWidth onClick={handleFinish} id="workout-confirm-finish" className="glow-emerald">
            ✅ Save Workout
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ExerciseCard({
  target, exercise, isSwapped, exerciseSets, isExpanded,
  onToggle, onLogSet, onSwap, onTechnique
}: {
  target: ProgramDayExercise;
  exercise: Exercise;
  isSwapped: boolean;
  exerciseSets: SetLog[];
  isExpanded: boolean;
  onToggle: () => void;
  onLogSet: (t: ProgramDayExercise, w: number, r: number, rir: number, pain: boolean, note?: string) => void;
  onSwap: () => void;
  onTechnique: () => void;
}) {
  const setsLogged = exerciseSets.length;
  const isDone = setsLogged >= target.targetSets;

  const lastSetWeight = exerciseSets.length > 0 ? exerciseSets[exerciseSets.length - 1]?.weightKg ?? 0 : 0;
  const [weight, setWeight] = useState(lastSetWeight || 20);
  const [reps, setReps] = useState(target.targetRepRangeLow);
  const [rir, setRir] = useState(target.targetRIR);

  // Pain Flag State
  const [painFlag, setPainFlag] = useState(false);
  const [painNote, setPainNote] = useState('');
  const hasPainLogged = exerciseSets.some((s) => s.painFlag);

  const handleSaveSet = () => {
    onLogSet(target, weight, reps, rir, painFlag, painNote);
    setPainFlag(false);
    setPainNote('');
  };

  return (
    <Card variant={isDone ? 'default' : 'elevated'} className={isDone ? 'opacity-70' : 'border-indigo-500/20'}>
      <button
        className="flex items-center gap-3.5 w-full text-left cursor-pointer"
        onClick={onToggle}
        id={`exercise-toggle-${exercise.id}`}
      >
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
          isDone ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-black'
        }`}>
          {isDone ? <Check size={22} strokeWidth={3} /> : `${setsLogged}/${target.targetSets}`}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-black text-slate-900 dark:text-white text-base truncate">{exercise.name}</p>
            {isSwapped && <Badge variant="warning" size="sm">Swapped</Badge>}
            {hasPainLogged && <Badge variant="danger" size="sm">⚠️ Pain Flagged</Badge>}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {target.targetSets} × {target.targetRepRangeLow}–{target.targetRepRangeHigh} reps · Target RIR {target.targetRIR}
          </p>
        </div>
        <Badge muscle={exercise.primaryMuscle as MuscleBadgeType} variant="muscle" size="sm" className="hidden sm:inline-flex">
          {exercise.primaryMuscle}
        </Badge>
        {isExpanded ? <ChevronUp size={20} className="text-slate-400 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 flex flex-col gap-4 border-t border-slate-200/80 dark:border-slate-800/80 mt-4">
              {/* Logged Sets History */}
              {exerciseSets.length > 0 && (
                <div className="flex flex-col gap-2">
                  {exerciseSets.map((set) => (
                    <div key={set.id} className="flex flex-col gap-1 p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 w-6">#{set.setNumber}</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{set.weightKg} kg</span>
                        <span className="text-slate-400 text-xs">×</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{set.reps} reps</span>
                        <Badge variant="info" size="sm" className="ml-auto">RIR {set.rir}</Badge>
                        {set.painFlag && <Badge variant="danger" size="sm">⚠️ Pain</Badge>}
                        <Check size={16} className="text-emerald-500" strokeWidth={3} />
                      </div>
                      {set.painFlag && (
                        <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold pl-9">
                          Note: {set.painNote || 'Discomfort reported.'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Static Non-Diagnostic Safety Warning if Pain Flagged */}
              {hasPainLogged && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-red-800 dark:text-red-300">
                  <ShieldAlert size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed font-medium">
                    <p className="font-bold text-red-700 dark:text-red-400">Safety Disclaimer</p>
                    Pain flagged on this movement. Stop immediately if pain persists. Consult a qualified healthcare professional if discomfort continues.
                  </div>
                </div>
              )}

              {/* Set Logging Section */}
              {!isDone && (
                <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-4 border border-indigo-500/30">
                  <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wider text-center">
                    LOG SET #{setsLogged + 1}
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4">
                      <Stepper
                        value={weight}
                        onChange={setWeight}
                        step={exercise.weightIncrementKg || 2.5}
                        min={0}
                        max={500}
                        label="WEIGHT (KG)"
                      />
                      <Stepper
                        value={reps}
                        onChange={setReps}
                        min={1}
                        max={50}
                        label="REPS"
                      />
                    </div>

                    {/* RIR Pill Selector */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                        RIR (Reps In Reserve)
                      </span>
                      <div className="flex gap-1.5 w-full max-w-xs">
                        {[0, 1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            id={`rir-btn-${exercise.id}-${r}`}
                            onClick={() => setRir(r)}
                            className={`flex-1 h-10 rounded-xl font-black text-sm transition-all cursor-pointer ${
                              rir === r
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Low-Friction Pain Flag Toggle */}
                    <div className="flex flex-col gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        id={`pain-flag-toggle-${exercise.id}`}
                        onClick={() => setPainFlag(!painFlag)}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                          painFlag
                            ? 'bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300 font-bold'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-xs font-semibold'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <AlertTriangle size={16} className={painFlag ? 'text-red-500' : 'text-slate-400'} />
                          {painFlag ? '⚠️ Pain Flagged on this set' : 'Flag Pain / Discomfort'}
                        </span>
                        <span className="text-[10px] uppercase font-bold">{painFlag ? 'ON' : 'OFF'}</span>
                      </button>

                      {painFlag && (
                        <input
                          type="text"
                          id={`pain-note-${exercise.id}`}
                          placeholder="Optional note: e.g. sharp pinch in shoulder..."
                          value={painNote}
                          onChange={(e) => setPainNote(e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-red-500/40 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium"
                        />
                      )}
                    </div>

                    <Button
                      variant="gradient"
                      size="lg"
                      fullWidth
                      onClick={handleSaveSet}
                      id={`log-set-btn-${exercise.id}`}
                      className="mt-1 glow-indigo"
                    >
                      ✓ Save Set #{setsLogged + 1}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" fullWidth onClick={onTechnique} id={`technique-btn-${exercise.id}`}>
                  <Info size={14} /> Technique
                </Button>
                <Button variant="secondary" size="sm" fullWidth onClick={onSwap} id={`swap-btn-${exercise.id}`}>
                  <RefreshCw size={14} /> Swap Exercise
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function SwapModalContent({
  target, exerciseMap, onSwap,
}: {
  target: ProgramDayExercise;
  exerciseMap: Map<number, Exercise>;
  onSwap: (newId: number) => void;
}) {
  const originalExercise = exerciseMap.get(target.exerciseId);
  if (!originalExercise) return null;

  const substitutes = originalExercise.substituteIds
    .map((id) => exerciseMap.get(id))
    .filter(Boolean) as Exercise[];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Choose a valid substitute. Replaces this movement for today's session only.
      </p>
      {substitutes.map((sub) => (
        <button
          key={sub.id}
          id={`swap-to-${sub.id}`}
          onClick={() => onSwap(sub.id!)}
          className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all cursor-pointer"
        >
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 dark:text-white text-sm truncate">{sub.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">{sub.equipment} · {sub.primaryMuscle}</p>
          </div>
          <Badge muscle={sub.primaryMuscle as MuscleBadgeType} variant="muscle" size="sm">
            {sub.primaryMuscle}
          </Badge>
        </button>
      ))}
      {substitutes.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-4 font-medium">No substitutes configured.</p>
      )}
    </div>
  );
}

function TechniqueContent({ exercise }: { exercise: Exercise }) {
  const notes = exercise.techniqueNotes;
  const sections = [
    { label: '🔧 Setup', text: notes.setup },
    { label: '⚡ Execution', text: notes.execution },
    { label: '❌ Common Mistakes', text: notes.commonMistakes },
    { label: '💨 Breathing Cues', text: notes.breathingCues },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        <Badge muscle={exercise.primaryMuscle as MuscleBadgeType} variant="muscle" size="md">{exercise.primaryMuscle}</Badge>
        <Badge variant="default" size="md">{exercise.equipment}</Badge>
        <Badge variant="purple" size="md">{exercise.difficultyTier}</Badge>
      </div>
      {sections.map(({ label, text }) => (
        <div key={label} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800">
          <p className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wide mb-1">{label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{text}</p>
        </div>
      ))}
    </div>
  );
}
