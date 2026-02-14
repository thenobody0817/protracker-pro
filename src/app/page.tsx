'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, RefreshCw, Download, Upload, 
  AlertCircle, Loader2, Sparkles
} from 'lucide-react';
import { useWorkoutStore, Exercise } from '@/store/workout-store';
import { SessionTabs } from '@/components/workout/session-tabs';
import { ExerciseCard } from '@/components/workout/exercise-card';
import { TimerDisplay } from '@/components/workout/timer-display';
import { ExerciseDetailModal } from '@/components/workout/exercise-detail-modal';
import { FooterStats } from '@/components/workout/footer-stats';
import { HistoryPanel } from '@/components/workout/history-panel';
import { SettingsPanel } from '@/components/workout/settings-panel';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProTrackerPage() {
  const {
    sessions,
    currentSessionCode,
    settings,
    setSessions,
    setHistory,
    setPersonalRecords,
    setStreak,
    setLast7Days,
    resetWorkout,
    resetAllData
  } = useWorkoutStore();

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch workouts from API
  const fetchWorkouts = useCallback(async () => {
    try {
      const response = await fetch('/api/workouts');
      const data = await response.json();
      
      if (data.success) {
        // Merge with local completed sets
        const localSessions = useWorkoutStore.getState().sessions;
        const mergedSessions = data.data.map((session: { id: string; code: string; exercises: { id: string }[] }) => {
          const localSession = localSessions.find(s => s.code === session.code);
          if (localSession) {
            return {
              ...session,
              exercises: session.exercises.map((ex: { id: string }) => {
                const localEx = localSession.exercises.find(e => e.id === ex.id);
                return {
                  ...ex,
                  completedSets: localEx?.completedSets || 0
                };
              })
            };
          }
          return {
            ...session,
            exercises: session.exercises.map((ex: { id: string }) => ({
              ...ex,
              completedSets: 0
            }))
          };
        });
        setSessions(mergedSessions);
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
      toast.error('Failed to load workouts');
    }
  }, [setSessions]);

  // Fetch history from API
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      
      if (data.success) {
        const historyData = data.data.history.map((h: { id: string; exerciseId: string; completedAt: string; sets: number; weight: number | null; notes: string | null; exercise: { name: string } }) => ({
          id: h.id,
          exerciseId: h.exerciseId,
          exerciseName: h.exercise.name,
          completedAt: h.completedAt,
          sets: h.sets,
          weight: h.weight,
          notes: h.notes
        }));
        
        setHistory(historyData);
        setPersonalRecords(data.data.personalRecords);
        setStreak(data.data.stats.streak);
        setLast7Days(data.data.stats.last7Days);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setHistory, setPersonalRecords, setStreak, setLast7Days]);

  // Save settings to API
  const saveSettings = useCallback(async () => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  // Record workout completion
  const recordWorkout = useCallback(async (exerciseId: string, sets: number, weight?: number) => {
    try {
      const session = sessions.find(s => s.code === currentSessionCode);
      const exercise = session?.exercises.find(e => e.id === exerciseId);
      
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          sets,
          weight,
          exerciseName: exercise?.name,
          sessionId: session?.id
        })
      });
      
      // Refresh history
      fetchHistory();
    } catch (error) {
      console.error('Failed to record workout:', error);
    }
  }, [sessions, currentSessionCode, fetchHistory]);

  // Initial load
  useEffect(() => {
    fetchWorkouts();
    fetchHistory();
  }, [fetchWorkouts, fetchHistory]);

  // Save settings when they change
  useEffect(() => {
    saveSettings();
  }, [settings, saveSettings]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.className = `theme-${settings.theme}`;
  }, [settings.theme]);

  const handleShowDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleSaveExercise = (exercise: Exercise, updates: { load?: string; notes?: string }) => {
    console.log('Saving exercise:', exercise.id, updates);
    toast.success('Exercise updated');
  };

  const handleResetWorkout = () => {
    resetWorkout();
    toast.success('Workout reset');
  };

  const handleExportData = () => {
    const data = {
      sessions: useWorkoutStore.getState().sessions,
      history: useWorkoutStore.getState().history,
      personalRecords: useWorkoutStore.getState().personalRecords,
      settings: useWorkoutStore.getState().settings,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.sessions) setSessions(data.sessions);
        if (data.history) setHistory(data.history);
        if (data.personalRecords) setPersonalRecords(data.personalRecords);
        if (data.settings) useWorkoutStore.getState().setSettings(data.settings);
        
        toast.success('Data imported successfully');
      } catch {
        toast.error('Failed to import data');
      }
    };
    reader.readAsText(file);
  };

  const currentSession = sessions.find(s => s.code === currentSessionCode);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen bg-background transition-colors duration-500'
    )}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'sticky top-0 z-40',
          'bg-background/80 backdrop-blur-xl border-b border-border/50'
        )}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  ProTracker Pro
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Your fitness companion
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Import/Export */}
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExportData}
                  title="Export Data"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <label>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Import Data"
                  >
                    <span>
                      <Upload className="w-4 h-4" />
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>

              <HistoryPanel />
              <SettingsPanel />
            </div>
          </div>

          {/* Session Tabs */}
          <div className="mt-4 overflow-x-auto pb-2 -mx-4 px-4">
            <SessionTabs />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Session Title */}
        <motion.div
          key={currentSessionCode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold">{currentSession?.name}</h2>
          <p className="text-muted-foreground">
            {currentSession?.exercises.length || 0} exercises
          </p>
        </motion.div>

        {/* Exercise List */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {currentSession?.exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <ExerciseCard
                  exercise={exercise}
                  onShowDetails={handleShowDetails}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Empty State */}
        {(!currentSession || currentSession.exercises.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Exercises Found</h3>
            <p className="text-muted-foreground">
              This workout session has no exercises configured.
            </p>
          </motion.div>
        )}
      </main>

      {/* Timer Display */}
      <AnimatePresence>
        <TimerDisplay />
      </AnimatePresence>

      {/* Footer Stats */}
      <FooterStats 
        onReset={() => {
          handleResetWorkout();
        }}
      />

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExercise}
      />
    </div>
  );
}
