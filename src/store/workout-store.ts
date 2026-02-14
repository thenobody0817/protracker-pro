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

// Initial workout data
const initialSessions: WorkoutSession[] = [
  {
    id: 'session-a',
    name: 'Push + Shoulders',
    code: 'A',
    order: 0,
    exercises: [
      { id: 'a1', name: 'Seated Machine Shoulder Press', type: 'strength', reps: '5-7', setsTarget: 3, load: '45kg', rest: 120, instructions: 'Sit with back against the pad, grip handles at shoulder height. Press upward until arms are fully extended.', avoid: 'Do not arch your lower back. Avoid locking elbows at the top.', icon: 'dumbbell', order: 0, completedSets: 0 },
      { id: 'a2', name: 'Smith Flat Press', type: 'strength', reps: '6-8', setsTarget: 4, load: '48kg', rest: 120, instructions: 'Lie flat on the bench, grip bar slightly wider than shoulder width. Lower to chest level, then press up powerfully.', avoid: 'Don\'t bounce the bar off your chest. Avoid flaring elbows excessively.', icon: 'barbell', order: 1, completedSets: 0 },
      { id: 'a3', name: 'Seated Cable Row', type: 'strength', reps: '6-8', setsTarget: 4, load: '55kg', rest: 120, instructions: 'Sit with feet on platform, slight knee bend. Pull handle to lower chest, squeezing shoulder blades together.', avoid: 'Don\'t round your lower back. Avoid using momentum.', icon: 'cable', order: 2, completedSets: 0 },
      { id: 'a4', name: 'Cable Serratus Punch', type: 'strength', reps: '12-15', setsTarget: 2, load: '7.5kg', rest: 45, instructions: 'Stand facing away from cable, arm extended forward. Punch forward while protracting shoulder blade.', avoid: 'Don\'t bend the elbow during movement. Avoid rotating your torso.', icon: 'cable', order: 3, completedSets: 0 },
      { id: 'a5', name: 'Overhead Cable Triceps Extension', type: 'strength', reps: '8-10', setsTarget: 3, load: '12.5kg', rest: 90, instructions: 'Face away from cable machine, grip rope overhead. Extend arms forward, keeping elbows stationary.', avoid: 'Don\'t flare elbows out. Avoid leaning forward.', icon: 'cable', order: 4, completedSets: 0 },
      { id: 'a6', name: 'Incline Dumbbell Curl', type: 'strength', reps: '8-10', setsTarget: 3, load: '12kg', rest: 75, instructions: 'Sit on incline bench with dumbbells at sides. Curl both dumbbells with supination at the top.', avoid: 'Don\'t swing the weights. Avoid arching back.', icon: 'dumbbell', order: 5, completedSets: 0 }
    ]
  },
  {
    id: 'session-b',
    name: 'Pull + Arms',
    code: 'B',
    order: 1,
    exercises: [
      { id: 'b1', name: 'Neutral-Grip Lat Pulldown', type: 'strength', reps: '6-8', setsTarget: 4, load: '50kg', rest: 120, instructions: 'Grip the parallel handles, pull down to chest while leaning back slightly. Squeeze lats at the bottom.', avoid: 'Don\'t pull behind the neck. Avoid excessive leaning.', icon: 'cable', order: 0, completedSets: 0 },
      { id: 'b2', name: 'High-Incline Machine Press', type: 'strength', reps: '6-8', setsTarget: 3, load: '45kg', rest: 120, instructions: 'Set bench to high incline (30-45°). Press weight up, focusing on upper chest contraction.', avoid: 'Don\'t lock elbows. Avoid bouncing at bottom.', icon: 'dumbbell', order: 1, completedSets: 0 },
      { id: 'b3', name: 'Straight-Arm Cable Pulldown', type: 'strength', reps: '10-12', setsTarget: 2, load: '25kg', rest: 90, instructions: 'Stand with arms extended, pull rope down to thighs while keeping arms straight. Focus on lats.', avoid: 'Don\'t bend elbows. Avoid using body weight.', icon: 'cable', order: 2, completedSets: 0 },
      { id: 'b4', name: 'Prone Y-Raise', type: 'strength', reps: '12-15', setsTarget: 2, load: '2kg', rest: 60, instructions: 'Lie prone on bench, raise arms in Y position with thumbs up. Focus on lower trap engagement.', avoid: 'Don\'t use momentum. Avoid excessive weight.', icon: 'body', order: 3, completedSets: 0 },
      { id: 'b5', name: 'Chest-Supported Row', type: 'strength', reps: '8-10', setsTarget: 3, load: '20kg', rest: 90, instructions: 'Chest against pad, pull handles back squeezing shoulder blades. Full range of motion.', avoid: 'Don\'t lift chest off pad. Avoid shrugging shoulders.', icon: 'dumbbell', order: 4, completedSets: 0 },
      { id: 'b6', name: 'Cable Lateral Raise', type: 'strength', reps: '12-15', setsTarget: 3, load: '5kg', rest: 60, instructions: 'Stand sideways to cable, raise arm to side until parallel. Control the descent.', avoid: 'Don\'t raise above shoulder height. Avoid using momentum.', icon: 'cable', order: 5, completedSets: 0 },
      { id: 'b7', name: 'Rope Triceps Pushdown', type: 'strength', reps: '10-12', setsTarget: 3, load: '20kg', rest: 60, instructions: 'Grip rope at chest height, push down while spreading rope apart at bottom.', avoid: 'Don\'t lean forward. Avoid using shoulders.', icon: 'cable', order: 6, completedSets: 0 },
      { id: 'b8', name: 'EZ-Bar Curl', type: 'strength', reps: '8-10', setsTarget: 3, load: '30kg', rest: 75, instructions: 'Grip EZ bar with underhand grip, curl bar to chest with controlled motion.', avoid: 'Don\'t swing the bar. Avoid leaning back.', icon: 'barbell', order: 7, completedSets: 0 }
    ]
  },
  {
    id: 'session-c',
    name: 'Full Body',
    code: 'C',
    order: 2,
    exercises: [
      { id: 'c1', name: 'Machine Chest Press', type: 'strength', reps: '8-10', setsTarget: 3, load: '40kg', rest: 120, instructions: 'Sit in machine, grip handles at chest level. Press forward until arms extended, control return.', avoid: 'Don\'t lock elbows. Avoid using momentum.', icon: 'dumbbell', order: 0, completedSets: 0 },
      { id: 'c2', name: 'Supinated Pulldown', type: 'strength', reps: '8-10', setsTarget: 3, load: '45kg', rest: 120, instructions: 'Use underhand grip on bar, pull down to upper chest. Squeeze lats at bottom.', avoid: 'Don\'t pull behind neck. Avoid excessive lean.', icon: 'cable', order: 1, completedSets: 0 },
      { id: 'c3', name: 'SA Chest-Supported Row', type: 'strength', reps: '10-12', setsTarget: 3, load: '15kg', rest: 90, instructions: 'Single arm row with chest support. Pull dumbbell to hip, squeeze lat at top.', avoid: 'Don\'t rotate torso. Avoid using momentum.', icon: 'dumbbell', order: 2, completedSets: 0 },
      { id: 'c4', name: 'Cable External Rotation', type: 'strength', reps: '12-15', setsTarget: 2, load: '2kg', rest: 60, instructions: 'Stand sideways to cable, elbow at 90°. Rotate arm outward against resistance.', avoid: 'Don\'t move elbow. Avoid using shoulder.', icon: 'cable', order: 3, completedSets: 0 },
      { id: 'c5', name: 'Lateral Delt Machine', type: 'strength', reps: '12-15', setsTarget: 3, load: '20kg', rest: 60, instructions: 'Sit in machine, press arms outward to sides. Focus on medial deltoid.', avoid: 'Don\'t use momentum. Avoid shrugging.', icon: 'dumbbell', order: 4, completedSets: 0 },
      { id: 'c6', name: 'Reverse Pec Deck', type: 'strength', reps: '12-15', setsTarget: 3, load: '25kg', rest: 60, instructions: 'Sit facing machine, pull handles back squeezing rear delts. Control forward motion.', avoid: 'Don\'t use momentum. Avoid pinching shoulder blades too hard.', icon: 'cable', order: 5, completedSets: 0 },
      { id: 'c7', name: 'Rope Hammer Curl', type: 'strength', reps: '10-12', setsTarget: 3, load: '15kg', rest: 60, instructions: 'Grip rope attached to low cable, curl with neutral grip. Focus on brachialis.', avoid: 'Don\'t swing. Avoid leaning back.', icon: 'cable', order: 6, completedSets: 0 },
      { id: 'c8', name: 'SA Overhead Cable Triceps', type: 'strength', reps: '12-15', setsTarget: 2, load: '5kg', rest: 60, instructions: 'Single arm overhead extension with cable. Extend fully, control return.', avoid: 'Don\'t flare elbow. Avoid leaning.', icon: 'cable', order: 7, completedSets: 0 }
    ]
  },
  {
    id: 'session-x',
    name: 'Recovery/Mobility',
    code: 'X',
    order: 3,
    exercises: [
      { id: 'x1', name: 'Supine full-body reach', type: 'mobility', reps: '30s', setsTarget: 2, load: null, rest: 0, instructions: 'Lie on back, extend arms overhead and legs straight. Reach and stretch entire body.', avoid: 'Don\'t hold breath. Avoid straining neck.', icon: 'body', order: 0, completedSets: 0 },
      { id: 'x2', name: 'Child\'s pose', type: 'mobility', reps: '45s', setsTarget: 2, load: null, rest: 0, instructions: 'Kneel, sit back on heels, stretch arms forward on floor. Breathe deeply into stretch.', avoid: 'Don\'t force the position. Avoid holding breath.', icon: 'body', order: 1, completedSets: 0 },
      { id: 'x3', name: '90/90 floor traction', type: 'mobility', reps: '30s', setsTarget: 2, load: null, rest: 0, instructions: 'Sit with one leg in front at 90°, other to side at 90°. Shift weight forward and back.', avoid: 'Don\'t force range. Avoid knee pain.', icon: 'body', order: 2, completedSets: 0 },
      { id: 'x4', name: 'Slow nasal breathing', type: 'mobility', reps: '120s', setsTarget: 1, load: null, rest: 0, instructions: 'Sit comfortably, breathe slowly through nose. 4-6 breaths per minute ideal.', avoid: 'Don\'t mouth breathe. Avoid rushed breaths.', icon: 'body', order: 3, completedSets: 0 },
      { id: 'x5', name: 'Dead bug', type: 'mobility', reps: '8', setsTarget: 3, load: null, rest: 30, instructions: 'Lie on back, arms up and knees at 90°. Lower opposite arm and leg, return.', avoid: 'Don\'t let lower back arch. Avoid holding breath.', icon: 'body', order: 4, completedSets: 0 },
      { id: 'x6', name: 'Hollow body hold', type: 'mobility', reps: '30s', setsTarget: 3, load: null, rest: 30, instructions: 'Lie on back, lift shoulders and legs slightly off ground. Keep lower back pressed down.', avoid: 'Don\'t let back arch. Avoid straining neck.', icon: 'body', order: 5, completedSets: 0 },
      { id: 'x7', name: 'Side plank', type: 'mobility', reps: '30s', setsTarget: 3, load: null, rest: 30, instructions: 'Lie on side, prop up on elbow, lift hips. Hold while keeping body straight.', avoid: 'Don\'t let hips sag. Avoid holding breath.', icon: 'body', order: 6, completedSets: 0 }
    ]
  },
  {
    id: 'session-y',
    name: 'Warmup',
    code: 'Y',
    order: 4,
    exercises: [
      { id: 'y1', name: 'Wall slides', type: 'warmup', reps: '10', setsTarget: 2, load: null, rest: 15, instructions: 'Stand with back against wall, arms in goal post position. Slide arms up and down wall.', avoid: 'Don\'t arch lower back. Avoid forcing range.', icon: 'body', order: 0, completedSets: 0 },
      { id: 'y2', name: 'Scapular push-ups', type: 'warmup', reps: '10', setsTarget: 2, load: null, rest: 15, instructions: 'In push-up position, squeeze shoulder blades together then apart without bending elbows.', avoid: 'Don\'t bend arms. Avoid sagging hips.', icon: 'body', order: 1, completedSets: 0 },
      { id: 'y3', name: 'Prone Y-hold', type: 'warmup', reps: '25s', setsTarget: 2, load: null, rest: 15, instructions: 'Lie prone, raise arms in Y position with thumbs up. Hold and engage lower traps.', avoid: 'Don\'t use momentum. Avoid excessive weight.', icon: 'body', order: 2, completedSets: 0 },
      { id: 'y4', name: 'Shoulder CARs', type: 'warmup', reps: '3', setsTarget: 2, load: null, rest: 15, instructions: 'Controlled articular rotations - move arm in full circles while keeping torso still.', avoid: 'Don\'t let torso move. Avoid rushing.', icon: 'body', order: 3, completedSets: 0 },
      { id: 'y5', name: 'Deep squat hold', type: 'warmup', reps: '75s', setsTarget: 2, load: null, rest: 30, instructions: 'Sink into deep squat, keep heels down, chest up. Use support if needed.', avoid: 'Don\'t let heels rise. Avoid rounding back excessively.', icon: 'body', order: 4, completedSets: 0 },
      { id: 'y6', name: 'Overhead reach + side bend', type: 'warmup', reps: '20s', setsTarget: 2, load: null, rest: 15, instructions: 'Reach arms overhead, then lean side to side in controlled motion.', avoid: 'Don\'t arch lower back. Avoid forcing range.', icon: 'body', order: 5, completedSets: 0 }
    ]
  }
];

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
  initializeData: () => void;
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

      initializeData: () => {
        const state = get();
        if (state.sessions.length === 0) {
          set({ sessions: initialSessions });
        }
      },

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
          if (settings.soundEnabled) {
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
            } catch {
              console.log('Audio not available');
            }
          }
          
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
        const resetSessions = initialSessions.map(session => ({
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
          sessions: initialSessions,
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
        completedToday: state.completedToday ? Array.from(state.completedToday) : []
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.completedToday = new Set(state.completedToday as unknown as string[]);
        }
      }
    }
  )
);
