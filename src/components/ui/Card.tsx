import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'hero' | 'emerald' | 'amber';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  const base = 'rounded-3xl p-5 transition-all duration-200';
  const variants = {
    default:
      'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg text-slate-900 dark:text-slate-100',
    elevated:
      'bg-slate-50/80 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-md dark:shadow-xl text-slate-900 dark:text-slate-100',
    glass:
      'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 shadow-sm dark:shadow-xl text-slate-900 dark:text-slate-100',
    hero:
      'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border border-white/20 shadow-xl shadow-indigo-600/20',
    emerald:
      'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white border border-white/20 shadow-xl shadow-emerald-600/20',
    amber:
      'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white border border-white/20 shadow-xl shadow-amber-500/20',
  };

  return (
    <div className={cn(base, variants[variant], className)}>
      {children}
    </div>
  );
}
