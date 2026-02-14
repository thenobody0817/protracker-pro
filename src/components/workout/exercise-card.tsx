'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Link2, Zap, User, 
  Info, Check, ChevronDown, ChevronUp,
  Timer, Weight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkoutStore, Exercise as ExerciseType } from '@/store/workout-store';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ExerciseCardProps {
  exercise: ExerciseType;
  onShowDetails: (exercise: ExerciseType) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dumbbell: Dumbbell,
  cable: Link2,
  barbell: Zap,
  body: User,
};

export function ExerciseCard({ exercise, onShowDetails }: ExerciseCardProps) {
  const isCompleted = exercise.completedSets >= exercise.setsTarget;
  const [isOpen, setIsOpen] = useState(!isCompleted);
  const { updateExerciseSets, startTimer, settings, activeTimer, completeExercise } = useWorkoutStore();
  const isActiveTimer = activeTimer.exerciseId === exercise.id;

  // Compute if card should be collapsed based on completion
  const shouldShowOpen = useMemo(() => {
    return isOpen && !isCompleted;
  }, [isOpen, isCompleted]);

  const IconComponent = iconMap[exercise.icon || 'dumbbell'] || Dumbbell;

  const handleSetClick = (setIndex: number) => {
    const newCompletedSets = setIndex < exercise.completedSets ? setIndex : setIndex + 1;
    updateExerciseSets(exercise.id, newCompletedSets);
    
    // Vibration feedback
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(30);
    }

    // If completed all sets, collapse card
    if (newCompletedSets >= exercise.setsTarget) {
      setIsOpen(false);
    }

    // If completed all sets and has rest time, start timer
    if (newCompletedSets >= exercise.setsTarget && exercise.rest) {
      completeExercise(exercise.id);
      startTimer(exercise.rest, 'rest', exercise.id);
    } else if (newCompletedSets > exercise.completedSets && exercise.rest) {
      // Start timer after each set
      startTimer(exercise.rest, 'rest', exercise.id);
    }
  };

  const getExerciseTypeColor = () => {
    switch (exercise.type) {
      case 'strength':
        return 'border-l-rose-500';
      case 'mobility':
        return 'border-l-purple-500';
      case 'warmup':
        return 'border-l-amber-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border-l-4 bg-card/80 backdrop-blur-sm',
        'transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/5',
        isCompleted && 'opacity-60',
        isActiveTimer && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {/* Gradient overlay when completed */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      <Collapsible open={shouldShowOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-4 p-4 cursor-pointer">
            {/* Exercise Icon */}
            <div className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br',
              exercise.type === 'strength' && 'from-rose-500/20 to-orange-500/20 text-rose-500',
              exercise.type === 'mobility' && 'from-purple-500/20 to-pink-500/20 text-purple-500',
              exercise.type === 'warmup' && 'from-amber-500/20 to-yellow-500/20 text-amber-500'
            )}>
              <IconComponent className="w-6 h-6" />
            </div>

            {/* Exercise Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {exercise.name}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Weight className="w-3.5 h-3.5" />
                  {exercise.load || 'Bodyweight'}
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" />
                  {exercise.rest ? `${exercise.rest}s` : 'No rest'}
                </span>
                <span className="text-xs">
                  {exercise.setsTarget} × {exercise.reps || 'reps'}
                </span>
              </div>
            </div>

            {/* Set Completion Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: exercise.setsTarget }).map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetClick(i);
                  }}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                    'border-2',
                    i < exercise.completedSets
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-muted-foreground/30 hover:border-primary/50'
                  )}
                >
                  {i < exercise.completedSets && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Expand/Collapse Button */}
            <div className="flex-shrink-0">
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50"
          >
            <div className="p-4 space-y-3">
              {/* Instructions */}
              {exercise.instructions && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Instructions: </span>
                  <span className="text-foreground">{exercise.instructions}</span>
                </div>
              )}

              {/* What to avoid */}
              {exercise.avoid && (
                <div className="text-sm">
                  <span className="text-destructive">Avoid: </span>
                  <span className="text-muted-foreground">{exercise.avoid}</span>
                </div>
              )}

              {/* Action Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onShowDetails(exercise)}
              >
                <Info className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
