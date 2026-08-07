'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBodyMetrics, useAllExercises, useExerciseSetLogs, useStreak } from '@/lib/hooks/useProgress';
import { db } from '@/lib/db/db';
import { useProfile } from '@/lib/hooks/useProfile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, MuscleBadgeType } from '@/components/ui/Badge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Camera, Weight, TrendingUp, Flame, Plus, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toISODate, formatDisplayDate } from '@/lib/utils/dateHelpers';

export default function ProgressPage() {
  const profile = useProfile();
  const bodyMetrics = useBodyMetrics();
  const exercises = useAllExercises();
  const streak = useStreak();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | undefined>();
  const [weightInput, setWeightInput] = useState('');
  const [weightNote, setWeightNote] = useState('');
  const [logWeight, setLogWeight] = useState(false);
  const [photoView, setPhotoView] = useState<string | null>(null);
  const exerciseLogs = useExerciseSetLogs(selectedExerciseId);

  const handleLogWeight = async () => {
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 0) return;
    await db.bodyMetrics.add({
      date: toISODate(),
      bodyweightKg: val,
      notes: weightNote,
    });
    setWeightInput('');
    setWeightNote('');
    setLogWeight(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await db.bodyMetrics.add({
      date: toISODate(),
      bodyweightKg: 0,
      photoBlob: file,
      notes: 'Progress photo',
    });
  };

  const weightData = (bodyMetrics ?? []).filter(m => m.bodyweightKg > 0).map((m) => ({
    date: formatDisplayDate(m.date),
    weight: profile?.weightUnit === 'lb'
      ? Math.round(m.bodyweightKg * 2.20462 * 10) / 10
      : m.bodyweightKg,
  }));

  const exerciseChartData = (() => {
    if (!exerciseLogs || !exerciseLogs.length) return [];
    const bySession: Record<number, typeof exerciseLogs> = {};
    exerciseLogs.forEach(l => {
      if (!bySession[l.workoutSessionId]) bySession[l.workoutSessionId] = [];
      bySession[l.workoutSessionId].push(l);
    });
    return Object.entries(bySession).map(([, sets]) => ({
      date: formatDisplayDate(sets[0].createdAt.split('T')[0]),
      topWeight: Math.max(...sets.map(s => s.weightKg)),
      totalReps: sets.reduce((s, l) => s + l.reps, 0),
    }));
  })();

  const photoMetrics = (bodyMetrics ?? []).filter(m => m.photoBlob);

  return (
    <div className="page-content px-4 flex flex-col gap-6 max-w-lg mx-auto">
      <div className="pt-2">
        <h1 className="text-2xl font-black text-white tracking-tight">Progress Hub 🔥</h1>
        <p className="text-slate-400 text-xs font-medium">Your hypertrophy trajectory</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="hero" className="text-center py-4 px-2 glow-indigo">
          <Flame size={22} className="text-amber-300 mx-auto mb-1" />
          <p className="text-2xl font-black">{streak?.current ?? 0}</p>
          <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider">Week Streak</p>
        </Card>
        <Card variant="emerald" className="text-center py-4 px-2 glow-emerald">
          <TrendingUp size={22} className="text-emerald-200 mx-auto mb-1" />
          <p className="text-2xl font-black">{streak?.thisMonth ?? 0}</p>
          <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">This Month</p>
        </Card>
        <Card variant="amber" className="text-center py-4 px-2 glow-amber">
          <Weight size={22} className="text-slate-950 mx-auto mb-1" />
          <p className="text-2xl font-black text-slate-950">
            {bodyMetrics?.length ? `${bodyMetrics[bodyMetrics.length - 1]?.bodyweightKg}kg` : '–'}
          </p>
          <p className="text-[10px] text-slate-900 font-bold uppercase tracking-wider">Bodyweight</p>
        </Card>
      </div>

      {/* Bodyweight chart */}
      <Card variant="elevated" className="border-indigo-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Metric Trend</p>
            <h2 className="text-lg font-black text-white">Bodyweight History</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLogWeight(!logWeight)}
            id="log-weight-toggle"
          >
            <Plus size={14} /> Log Weigh-In
          </Button>
        </div>

        {logWeight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 flex gap-2"
          >
            <input
              id="bodyweight-input"
              type="number"
              step="0.1"
              placeholder={`Weight (${profile?.weightUnit ?? 'kg'})`}
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="flex-1 h-11 px-3 rounded-2xl border border-slate-700 bg-slate-900 text-white text-sm"
            />
            <Button size="sm" onClick={handleLogWeight} id="bodyweight-save-btn">Save</Button>
          </motion.div>
        )}

        {weightData.length > 1 ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a', border: '1px solid #334155', borderRadius: 16,
                  fontSize: 12, color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#6366F1"
                strokeWidth={3}
                fill="url(#weightGrad)"
                dot={{ fill: '#8B5CF6', r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-32 flex items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <p className="text-slate-500 text-xs font-semibold">Log 2+ weigh-ins to see line chart</p>
          </div>
        )}
      </Card>

      {/* Strength chart */}
      <Card variant="elevated" className="border-purple-500/20">
        <h2 className="text-lg font-black text-white mb-1">Overload Tracker</h2>
        <p className="text-xs text-slate-400 mb-4">Track top-set weight over time per exercise</p>

        <select
          id="exercise-select"
          value={selectedExerciseId ?? ''}
          onChange={(e) => setSelectedExerciseId(e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full h-12 px-4 rounded-2xl border border-slate-700 bg-slate-900 text-white text-sm font-semibold mb-4 cursor-pointer"
        >
          <option value="">Select exercise to plot…</option>
          {(exercises ?? []).map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>

        {exerciseChartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={exerciseChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0f172a', border: '1px solid #334155', borderRadius: 16,
                  fontSize: 12, color: '#f8fafc',
                }}
              />
              <Line
                type="monotone"
                dataKey="topWeight"
                name="Top Weight (kg)"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#34D399', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : selectedExerciseId ? (
          <div className="h-28 flex items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <p className="text-slate-500 text-xs font-semibold">Log 2+ sessions of this movement to render graph</p>
          </div>
        ) : (
          <div className="h-28 flex items-center justify-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <p className="text-slate-500 text-xs font-semibold">Select an exercise from dropdown above</p>
          </div>
        )}
      </Card>

      {/* Progress Photos */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Visual Physique</p>
            <h2 className="text-lg font-black text-white">Progress Photos</h2>
          </div>
          <label className="cursor-pointer" htmlFor="photo-upload">
            <div className="flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30">
              <Camera size={16} /> Upload Photo
            </div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {photoMetrics.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5">
            {photoMetrics.map((m) => (
              <PhotoThumb key={m.id} metric={m} onClick={(url) => setPhotoView(url)} />
            ))}
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center gap-2 bg-slate-900/60 rounded-2xl border border-slate-800">
            <ImageIcon size={32} className="text-slate-600" />
            <p className="text-slate-500 text-xs font-medium">No progress photos uploaded yet</p>
          </div>
        )}
      </Card>

      {/* Lightbox */}
      {photoView && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setPhotoView(null)}
        >
          <img src={photoView} alt="Progress photo" className="max-w-full max-h-full object-contain rounded-3xl" />
        </div>
      )}
    </div>
  );
}

function PhotoThumb({ metric, onClick }: { metric: any; onClick: (url: string) => void }) {
  const [url, setUrl] = useState<string | null>(null);
  if (metric.photoBlob && !url) {
    const reader = new FileReader();
    reader.onload = (e) => setUrl(e.target?.result as string);
    reader.readAsDataURL(metric.photoBlob);
  }
  if (!url) return <div className="aspect-square bg-slate-800 rounded-2xl animate-pulse" />;
  return (
    <button onClick={() => onClick(url!)} className="block group cursor-pointer" id={`photo-${metric.id}`}>
      <img
        src={url}
        alt={metric.date}
        className="aspect-square object-cover rounded-2xl w-full border border-slate-800 group-hover:border-indigo-500 transition-all"
      />
      <p className="text-[10px] font-bold text-slate-400 text-center mt-1">{formatDisplayDate(metric.date)}</p>
    </button>
  );
}
