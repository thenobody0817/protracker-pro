'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, SkipForward, Plus, Minus, X } from 'lucide-react';
import { useWorkoutStore } from '@/store/workout-store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function TimerDisplay() {
  const { activeTimer, tickTimer, stopTimer, startTimer } = useWorkoutStore();

  useEffect(() => {
    if (!activeTimer.isRunning) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer.isRunning, tickTimer]);

  if (!activeTimer.isRunning) return null;

  const progress = ((activeTimer.totalSeconds - activeTimer.secondsLeft) / activeTimer.totalSeconds) * 100;
  const minutes = Math.floor(activeTimer.secondsLeft / 60);
  const seconds = activeTimer.secondsLeft % 60;

  const handleExtend = (amount: number) => {
    startTimer(
      activeTimer.secondsLeft + amount,
      activeTimer.type,
      activeTimer.exerciseId || ''
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className={cn(
        'fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40',
        'rounded-2xl p-4 shadow-2xl',
        'bg-gradient-to-br',
        activeTimer.type === 'rest' 
          ? 'from-blue-500/90 to-cyan-500/90' 
          : 'from-rose-500/90 to-orange-500/90',
        'backdrop-blur-xl border border-white/20'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-white">
          <Timer className="w-5 h-5" />
          <span className="font-semibold">
            {activeTimer.type === 'rest' ? 'Rest Timer' : 'Work Timer'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
          onClick={stopTimer}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-3">
        <motion.div
          key={activeTimer.secondsLeft}
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold text-white font-mono"
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </motion.div>
      </div>

      {/* Progress Bar */}
      <Progress 
        value={progress} 
        className="h-2 mb-3 bg-white/20"
      />

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white border-0"
          onClick={() => handleExtend(-30)}
          disabled={activeTimer.secondsLeft <= 30}
        >
          <Minus className="w-4 h-4 mr-1" />
          30s
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white border-0"
          onClick={stopTimer}
        >
          <SkipForward className="w-4 h-4 mr-1" />
          Skip
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white border-0"
          onClick={() => handleExtend(30)}
        >
          <Plus className="w-4 h-4 mr-1" />
          30s
        </Button>
      </div>
    </motion.div>
  );
}

export function MiniTimerDisplay() {
  const { activeTimer } = useWorkoutStore();

  if (!activeTimer.isRunning) return null;

  const minutes = Math.floor(activeTimer.secondsLeft / 60);
  const seconds = activeTimer.secondsLeft % 60;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-sm">
      <Timer className="w-4 h-4" />
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}
