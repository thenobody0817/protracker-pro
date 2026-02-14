'use client';

import { motion } from 'framer-motion';
import { useWorkoutStore } from '@/store/workout-store';
import { cn } from '@/lib/utils';

const SESSION_CONFIGS = [
  { code: 'A', name: 'Push + Shoulders', color: 'from-rose-500 to-orange-500' },
  { code: 'B', name: 'Pull + Arms', color: 'from-blue-500 to-cyan-500' },
  { code: 'C', name: 'Full Body', color: 'from-emerald-500 to-teal-500' },
  { code: 'X', name: 'Recovery', color: 'from-purple-500 to-pink-500' },
  { code: 'Y', name: 'Warmup', color: 'from-amber-500 to-yellow-500' }
];

export function SessionTabs() {
  const { currentSessionCode, setCurrentSession, sessions } = useWorkoutStore();

  const getSessionProgress = (code: string) => {
    const session = sessions.find(s => s.code === code);
    if (!session) return 0;
    const totalSets = session.exercises.reduce((acc, ex) => acc + ex.setsTarget, 0);
    const completedSets = session.exercises.reduce((acc, ex) => acc + ex.completedSets, 0);
    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };

  return (
    <div className="relative">
      <div className="flex gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-2xl backdrop-blur-sm">
        {SESSION_CONFIGS.map((config) => {
          const isActive = currentSessionCode === config.code;
          const progress = getSessionProgress(config.code);

          return (
            <button
              key={config.code}
              onClick={() => setCurrentSession(config.code)}
              className={cn(
                'relative flex flex-col items-center justify-center py-2.5 px-4 rounded-xl transition-all duration-300',
                'min-w-[60px] group',
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="session-indicator"
                  className={cn(
                    'absolute inset-0 rounded-xl bg-gradient-to-br shadow-lg',
                    config.color
                  )}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Progress ring */}
              <div className="relative z-10">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="opacity-20"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${progress * 0.88} 88`}
                    className={cn(
                      'transition-all duration-500',
                      isActive ? 'text-white' : 'text-primary'
                    )}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  {config.code}
                </span>
              </div>
              
              <span className={cn(
                'text-xs mt-1 font-medium transition-all duration-300 z-10',
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}>
                {config.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
