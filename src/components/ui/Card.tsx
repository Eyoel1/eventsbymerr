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
      'bg-slate-800/80 border border-slate-700/60 shadow-lg shadow-black/20 backdrop-blur-md',
    elevated:
      'bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-xl shadow-black/40',
    glass:
      'bg-slate-800/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-950/30',
    hero:
      'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border border-white/20 shadow-xl shadow-indigo-600/30',
    emerald:
      'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white border border-white/20 shadow-xl shadow-emerald-600/30',
    amber:
      'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white border border-white/20 shadow-xl shadow-amber-500/30',
  };
  return (
    <div className={cn(base, variants[variant], className)}>
      {children}
    </div>
  );
}
