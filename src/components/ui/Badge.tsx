import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type MuscleBadgeType =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'biceps'
  | 'triceps'
  | 'core';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink' | 'muscle';
  muscle?: MuscleBadgeType;
  size?: 'sm' | 'md';
  className?: string;
}

const MUSCLE_STYLES: Record<MuscleBadgeType, string> = {
  chest: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
  back: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  shoulders: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
  quads: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  hamstrings: 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border-teal-500/30',
  glutes: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/30',
  calves: 'bg-lime-500/10 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400 border-lime-500/30',
  biceps: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
  triceps: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
  core: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
};

export function Badge({ children, variant = 'default', muscle, size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
    info: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
    purple: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
    pink: 'bg-pink-500/10 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30',
    muscle: muscle ? MUSCLE_STYLES[muscle] : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 font-semibold capitalize',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border backdrop-blur-sm',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
