'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, BarChart2, Calendar, Star, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/today', icon: Dumbbell, label: 'Today' },
  { href: '/program', icon: Calendar, label: 'Program' },
  { href: '/progress', icon: BarChart2, label: 'Progress' },
  { href: '/review', icon: Star, label: 'Reviews' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-50 px-4 max-w-md mx-auto pointer-events-none safe-bottom">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-1.5 shadow-lg dark:shadow-2xl pointer-events-auto border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-around">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-colors duration-150"
              aria-label={label}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-indigo-600 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 rounded-2xl glow-indigo shadow-md"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${
                    active
                      ? 'text-white scale-110'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-bold tracking-tight ${
                    active ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
