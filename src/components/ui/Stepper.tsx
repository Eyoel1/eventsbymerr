'use client';
import { useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  className,
}: StepperProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const change = (delta: number) => {
    onChange(Math.min(max, Math.max(min, Number((value + delta).toFixed(2)))));
  };

  const startHold = (delta: number) => {
    intervalRef.current = setInterval(() => change(delta * 2), 120);
  };

  const stopHold = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      {label && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-inner">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onPointerDown={() => startHold(-step)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onClick={() => change(-step)}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-90 text-indigo-600 dark:text-indigo-400 font-black transition-all shadow-xs border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
        >
          <Minus size={18} strokeWidth={3} />
        </button>
        <div className="w-16 h-11 flex items-center justify-center">
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
        </div>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onPointerDown={() => startHold(step)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onClick={() => change(step)}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-90 text-indigo-600 dark:text-indigo-400 font-black transition-all shadow-xs border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
