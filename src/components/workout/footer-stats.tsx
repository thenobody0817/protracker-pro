'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Target, RotateCcw } from 'lucide-react';
import { useWorkoutStore } from '@/store/workout-store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MiniTimerDisplay } from './timer-display';
import { cn } from '@/lib/utils';

interface FooterStatsProps {
  onReset: () => void;
}

export function FooterStats({ onReset }: FooterStatsProps) {
  const { sessions, currentSessionCode, streak, completedToday } = useWorkoutStore();

  const currentSession = sessions.find(s => s.code === currentSessionCode);
  
  const totalExercises = currentSession?.exercises.length || 0;
  const completedExercises = currentSession?.exercises.filter(
    ex => ex.completedSets >= ex.setsTarget
  ).length || 0;
  
  const totalSets = currentSession?.exercises.reduce((acc, ex) => acc + ex.setsTarget, 0) || 0;
  const completedSets = currentSession?.exercises.reduce((acc, ex) => acc + ex.completedSets, 0) || 0;
  
  const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30',
        'bg-background/95 backdrop-blur-xl border-t border-border/50',
        'px-4 py-3 md:px-6'
      )}
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Session Progress</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Stats */}
          <div className="flex items-center gap-4">
            {/* Completed Exercises */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold">{completedExercises}/{totalExercises}</div>
                <div className="text-xs text-muted-foreground">Exercises</div>
              </div>
            </div>

            {/* Completed Sets */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-blue-500" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold">{completedSets}/{totalSets}</div>
                <div className="text-xs text-muted-foreground">Sets</div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold">{streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Right Side - Timer & Actions */}
          <div className="flex items-center gap-3">
            <MiniTimerDisplay />
            
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
