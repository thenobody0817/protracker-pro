import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Exercise {
  id: string;
  name: string;
  type: string;
  reps: string | null;
  setsTarget: number;
  load: string | null;
  rest: number | null;
  instructions: string | null;
  avoid: string | null;
  icon: string | null;
  order: number;
  completedSets: number;
}

export interface WorkoutSession {
  id: string;
  name: string;
  code: string;
  order: number;
  exercises: Exercise[];
}

export interface WorkoutHistory {
  id: string;
  exerciseId: string;
  exerciseName: string;
  completedAt: string;
  sets: number;
  weight: number | null;
  notes: string | null;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  weight: number;
  reps: number | null;
  date: string;
}

export interface UserSettings {
  theme: 'glass' | 'midnight' | 'light' | 'cyber';
  soundEnabled: boolean;
  defaultRestTime: number;
  vibrationEnabled: boolean;
}

interface WorkoutState {
  sessions: WorkoutSession[];
  currentSessionCode: string;
  settings: UserSettings;
  history: WorkoutHistory[];
  personalRecords: PersonalRecord[];
  streak: number;
  last7Days: { date: string; count: number }[];
  activeTimer: {
    isRunning: boolean;
    secondsLeft: number;
    totalSeconds: number;
    type: 'rest' | 'work';
    exerciseId: string | null;
  };
  completedToday: Set<string>;

  // Actions
  setSessions: (sessions: WorkoutSession[]) => void;
  setCurrentSession: (code: string) => void;
  updateExerciseSets: (exerciseId: string, sets: number) => void;
  completeExercise: (exerciseId: string) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  setTheme: (theme: UserSettings['theme']) => void;
  startTimer: (seconds: number, type: 'rest' | 'work', exerciseId: string) => void;
  stopTimer: () => void;
  tickTimer: () => void;
  addHistory: (history: WorkoutHistory) => void;
  setHistory: (history: WorkoutHistory[]) => void;
  setPersonalRecords: (records: PersonalRecord[]) => void;
  setStreak: (streak: number) => void;
  setLast7Days: (days: { date: string; count: number }[]) => void;
  resetWorkout: () => void;
  resetAllData: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'glass',
  soundEnabled: true,
  defaultRestTime: 90,
  vibrationEnabled: true
};

const defaultTimer = {
  isRunning: false,
  secondsLeft: 0,
  totalSeconds: 0,
  type: 'rest' as const,
  exerciseId: null
};

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionCode: 'A',
      settings: defaultSettings,
      history: [],
      personalRecords: [],
      streak: 0,
      last7Days: [],
      activeTimer: defaultTimer,
      completedToday: new Set(),

      setSessions: (sessions) => set({ sessions }),
      
      setCurrentSession: (code) => set({ currentSessionCode: code }),
      
      updateExerciseSets: (exerciseId, sets) => {
        const { sessions } = get();
        const updatedSessions = sessions.map(session => ({
          ...session,
          exercises: session.exercises.map(ex => 
            ex.id === exerciseId ? { ...ex, completedSets: sets } : ex
          )
        }));
        set({ sessions: updatedSessions });
      },
      
      completeExercise: (exerciseId) => {
        const { completedToday } = get();
        const newCompleted = new Set(completedToday);
        newCompleted.add(exerciseId);
        set({ completedToday: newCompleted });
      },
      
      setSettings: (newSettings) => {
        const { settings } = get();
        set({ settings: { ...settings, ...newSettings } });
      },
      
      setTheme: (theme) => {
        const { settings } = get();
        set({ settings: { ...settings, theme } });
      },
      
      startTimer: (seconds, type, exerciseId) => {
        set({
          activeTimer: {
            isRunning: true,
            secondsLeft: seconds,
            totalSeconds: seconds,
            type,
            exerciseId
          }
        });
      },
      
      stopTimer: () => {
        set({ activeTimer: defaultTimer });
      },
      
      tickTimer: () => {
        const { activeTimer, settings } = get();
        if (activeTimer.secondsLeft > 0) {
          set({
            activeTimer: {
              ...activeTimer,
              secondsLeft: activeTimer.secondsLeft - 1
            }
          });
        } else {
          // Timer finished
          if (settings.soundEnabled) {
            // Play sound via AudioContext
            try {
              const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.value = 880;
              oscillator.type = 'sine';
              gainNode.gain.value = 0.3;
              
              oscillator.start();
              setTimeout(() => oscillator.stop(), 200);
            } catch (e) {
              console.log('Audio not available');
            }
          }
          
          // Vibration feedback
          if (settings.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
          
          set({ activeTimer: defaultTimer });
        }
      },
      
      addHistory: (history) => {
        const { history: existingHistory } = get();
        set({ history: [history, ...existingHistory] });
      },
      
      setHistory: (history) => set({ history }),
      
      setPersonalRecords: (records) => set({ personalRecords: records }),
      
      setStreak: (streak) => set({ streak }),
      
      setLast7Days: (days) => set({ last7Days: days }),
      
      resetWorkout: () => {
        const { sessions } = get();
        const resetSessions = sessions.map(session => ({
          ...session,
          exercises: session.exercises.map(ex => ({
            ...ex,
            completedSets: 0
          }))
        }));
        set({ sessions: resetSessions, completedToday: new Set(), activeTimer: defaultTimer });
      },
      
      resetAllData: () => {
        set({
          sessions: [],
          currentSessionCode: 'A',
          settings: defaultSettings,
          history: [],
          personalRecords: [],
          streak: 0,
          last7Days: [],
          activeTimer: defaultTimer,
          completedToday: new Set()
        });
      }
    }),
    {
      name: 'protracker-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionCode: state.currentSessionCode,
        settings: state.settings,
        history: state.history,
        personalRecords: state.personalRecords,
        completedToday: state.completedToday
      })
    }
  )
);
