'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db/db';
import { seedExercises } from '@/lib/db/seed';
import { saveProfile } from '@/lib/hooks/useProfile';
import { generateProgram } from '@/lib/engine/programGenerator';
import type { Profile, Equipment, Sex, ExperienceLevel } from '@/lib/db/schema';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dumbbell, ChevronRight, ChevronLeft, Zap, Target, Calendar, AlertTriangle, Check, Sparkles } from 'lucide-react';

const TOTAL_STEPS = 6;

const EQUIPMENT_OPTIONS: { value: Equipment; label: string; emoji: string }[] = [
  { value: 'barbell', label: 'Barbell', emoji: '🏋️' },
  { value: 'dumbbell', label: 'Dumbbells', emoji: '💪' },
  { value: 'cable', label: 'Cable Machine', emoji: '🔗' },
  { value: 'machine', label: 'Machines', emoji: '⚙️' },
  { value: 'bodyweight', label: 'Bodyweight', emoji: '🤸' },
  { value: 'kettlebell', label: 'Kettlebell', emoji: '🔔' },
  { value: 'resistance_band', label: 'Resistance Bands', emoji: '🎯' },
];

const INJURY_OPTIONS = [
  'Lower back pain',
  'Knee issues',
  'Shoulder impingement',
  'Elbow tendinitis',
  'Hip pain',
  'Wrist pain',
];

interface FormData {
  age: number;
  sex: Sex;
  heightCm: number;
  bodywightKg: number;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  maxSessionMinutes: number;
  equipmentAccess: Equipment[];
  injuryLimitations: string;
  darkMode: boolean;
  weightUnit: 'kg' | 'lb';
}

const DEFAULT_FORM: FormData = {
  age: 25,
  sex: 'male',
  heightCm: 175,
  bodywightKg: 75,
  experienceLevel: 'beginner',
  trainingDaysPerWeek: 3,
  maxSessionMinutes: 60,
  equipmentAccess: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'],
  injuryLimitations: '',
  darkMode: true,
  weightUnit: 'kg',
};

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const goNext = () => { setDir(1); setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)); };
  const goPrev = () => { setDir(-1); setStep((s) => Math.max(s - 1, 0)); };

  const toggleEquipment = (eq: Equipment) => {
    set('equipmentAccess', form.equipmentAccess.includes(eq)
      ? form.equipmentAccess.filter((e) => e !== eq)
      : [...form.equipmentAccess, eq]);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await seedExercises();
      const profileId = await saveProfile({
        ...form,
        goal: 'hypertrophy',
        dislikedExerciseIds: [],
      });
      const profile = await db.profiles.get(profileId as number);
      if (profile) await generateProgram(profile);
      router.replace('/today');
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="flex flex-col items-center text-center gap-6 py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center glow-indigo shadow-2xl"
      >
        <Dumbbell size={48} className="text-white" strokeWidth={1.5} />
      </motion.div>
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Muscle Coach</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed font-medium">
          Personal hypertrophy training coach. <br />
          100% local on-device logic. Zero auth.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full mt-2">
        {[
          { icon: Target, text: 'Double progression overload engine' },
          { icon: Zap, text: 'Empirical deload & plateau detection' },
          { icon: Calendar, text: 'Interleaved hypertrophy splits' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Icon size={18} />
            </div>
            <span className="text-xs text-slate-800 dark:text-slate-200 font-bold text-left">{text}</span>
          </div>
        ))}
      </div>
      <Button variant="gradient" fullWidth size="xl" onClick={goNext} id="onboarding-start-btn" className="glow-indigo mt-2">
        Get Started <ChevronRight size={22} />
      </Button>
    </div>,

    // Step 1: Basic Stats
    <div key="stats" className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Basic Stats</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">Personalize your training baseline.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Age</label>
          <input
            id="onboarding-age"
            type="number"
            value={form.age}
            onChange={(e) => set('age', parseInt(e.target.value) || 18)}
            min={13} max={80}
            className="h-14 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-xl text-center shadow-xs"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weight (kg)</label>
          <input
            id="onboarding-weight"
            type="number"
            value={form.bodywightKg}
            onChange={(e) => set('bodywightKg', parseFloat(e.target.value) || 60)}
            min={30} max={250} step={0.5}
            className="h-14 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-xl text-center shadow-xs"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sex</label>
        <div className="flex gap-2">
          {(['male', 'female', 'other'] as Sex[]).map((s) => (
            <button
              key={s}
              id={`onboarding-sex-${s}`}
              type="button"
              onClick={() => set('sex', s)}
              className={`flex-1 h-13 rounded-2xl border-2 font-black text-sm capitalize transition-all cursor-pointer ${
                form.sex === s
                  ? 'border-indigo-500 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-600/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <Button variant="primary" fullWidth size="lg" onClick={goNext} id="onboarding-stats-next">
        Continue <ChevronRight size={20} />
      </Button>
    </div>,

    // Step 2: Experience Level
    <div key="experience" className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Experience Level</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">Select your background so we set rep/RIR targets accurately.</p>
      </div>
      {[
        { value: 'beginner', label: 'Beginner', desc: '< 1 year consistent lifting', emoji: '🌱' },
        { value: 'some_experience', label: 'Some Experience', desc: '1–2 years training experience', emoji: '📈' },
        { value: 'intermediate', label: 'Intermediate', desc: '2+ years, tracked overload', emoji: '🏆' },
      ].map((opt) => (
        <button
          key={opt.value}
          id={`onboarding-exp-${opt.value}`}
          type="button"
          onClick={() => { set('experienceLevel', opt.value as any); setTimeout(goNext, 180); }}
          className={`flex items-center gap-4 p-4 rounded-3xl border-2 text-left transition-all cursor-pointer ${
            form.experienceLevel === opt.value
              ? 'border-indigo-500 bg-indigo-600/10 dark:bg-indigo-600/20 glow-indigo'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <span className="text-3xl">{opt.emoji}</span>
          <div className="flex-1">
            <div className="font-black text-slate-900 dark:text-white text-base">{opt.label}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{opt.desc}</div>
          </div>
          {form.experienceLevel === opt.value && (
            <Check size={22} className="text-indigo-600 dark:text-indigo-400 shrink-0" strokeWidth={3} />
          )}
        </button>
      ))}
    </div>,

    // Step 3: Schedule
    <div key="schedule" className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Training Schedule</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">How many days per week will you commit?</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Target Frequency: {form.trainingDaysPerWeek} Days / Week
        </label>
        <div className="flex gap-2">
          {[2, 3, 4, 5, 6].map((d) => (
            <button
              key={d}
              id={`onboarding-days-${d}`}
              type="button"
              onClick={() => set('trainingDaysPerWeek', d)}
              className={`flex-1 h-14 rounded-2xl border-2 font-black text-xl transition-all cursor-pointer ${
                form.trainingDaysPerWeek === d
                  ? 'border-indigo-500 bg-indigo-600 text-white glow-indigo'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          {form.trainingDaysPerWeek <= 3
            ? '✓ Full Body Split (3x/wk) — High frequency per muscle group'
            : form.trainingDaysPerWeek === 4
            ? '✓ Interleaved Upper / Lower Split (4x/wk) — Balanced frequency & recovery'
            : '✓ Push / Pull / Legs Split — Dedicated volume per day'}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Max Session Time: {form.maxSessionMinutes} min
        </label>
        <input
          id="onboarding-session-length"
          type="range"
          min={30} max={120} step={15}
          value={form.maxSessionMinutes}
          onChange={(e) => set('maxSessionMinutes', parseInt(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-extrabold">
          <span>30 MIN</span><span>75 MIN</span><span>120 MIN</span>
        </div>
      </div>
      <Button variant="primary" fullWidth size="lg" onClick={goNext} id="onboarding-schedule-next">
        Continue <ChevronRight size={20} />
      </Button>
    </div>,

    // Step 4: Equipment
    <div key="equipment" className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Equipment Access</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">Select all equipment available in your gym.</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {EQUIPMENT_OPTIONS.map((eq) => {
          const selected = form.equipmentAccess.includes(eq.value);
          return (
            <button
              key={eq.value}
              id={`onboarding-equipment-${eq.value}`}
              type="button"
              onClick={() => toggleEquipment(eq.value)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                selected
                  ? 'border-indigo-500 bg-indigo-600/10 dark:bg-indigo-600/20 text-slate-900 dark:text-white font-bold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="text-2xl">{eq.emoji}</span>
              <span className="font-bold text-xs flex-1">{eq.label}</span>
              {selected && <Check size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
      <Button
        variant="primary"
        fullWidth size="lg"
        onClick={goNext}
        disabled={form.equipmentAccess.length === 0}
        id="onboarding-equipment-next"
      >
        Continue <ChevronRight size={20} />
      </Button>
    </div>,

    // Step 5: Limitations + Finish
    <div key="injuries" className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Injuries & Limitations</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">Optional — avoids aggravating movements.</p>
      </div>
      <div className="flex flex-col gap-2">
        {INJURY_OPTIONS.map((inj) => {
          const selected = form.injuryLimitations.split(',').map(s => s.trim()).includes(inj);
          return (
            <button
              key={inj}
              id={`onboarding-injury-${inj.replace(/\s/g, '-')}`}
              type="button"
              onClick={() => {
                const current = form.injuryLimitations.split(',').map(s => s.trim()).filter(Boolean);
                const next = selected ? current.filter((i) => i !== inj) : [...current, inj];
                set('injuryLimitations', next.join(', '));
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                selected
                  ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              <AlertTriangle size={18} className={selected ? 'text-amber-500' : 'text-slate-400'} />
              <span className="font-bold text-xs">{inj}</span>
            </button>
          );
        })}
      </div>
      <textarea
        id="onboarding-injury-notes"
        placeholder="Any custom injury notes… (optional)"
        value={form.injuryLimitations}
        onChange={(e) => set('injuryLimitations', e.target.value)}
        rows={2}
        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium resize-none shadow-xs"
      />
      <Button
        variant="gradient"
        fullWidth size="xl"
        onClick={handleFinish}
        disabled={loading}
        id="onboarding-finish-btn"
        className="glow-indigo"
      >
        {loading ? 'Building Phase 1 Program…' : '🚀 Build My Hypertrophy Program'}
      </Button>
    </div>,
  ];

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 flex flex-col justify-center px-4 py-8 max-w-lg mx-auto">
      {step > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goPrev}
              className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              id="onboarding-back-btn"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Step {step} / {TOTAL_STEPS - 1}</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              animate={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
