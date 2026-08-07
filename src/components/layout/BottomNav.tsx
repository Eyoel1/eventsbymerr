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
      <div className="glass-nav rounded-3xl p-1.5 shadow-2xl shadow-black/80 pointer-events-auto border border-white/10 flex items-center justify-around">
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
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 rounded-2xl glow-indigo border border-indigo-400/30"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${
                    active
                      ? 'text-white scale-110'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-bold tracking-tight ${
                    active ? 'text-white' : 'text-slate-400'
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
