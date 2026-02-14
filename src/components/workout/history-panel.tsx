'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, X, Calendar, Trophy, Flame, 
  TrendingUp, ChevronRight, BarChart3
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useWorkoutStore, WorkoutHistory as HistoryType } from '@/store/workout-store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function HistoryPanel() {
  const { history, streak, last7Days, personalRecords } = useWorkoutStore();
  const [open, setOpen] = useState(false);

  const groupedHistory = history.reduce((acc, item) => {
    const date = new Date(item.completedAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, HistoryType[]>);

  const totalVolume = history.reduce((acc, h) => acc + (h.weight || 0) * h.sets, 0);
  const totalWorkouts = Object.keys(groupedHistory).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <History className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Workout History
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                <Trophy className="w-5 h-5 text-amber-500 mb-2" />
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <Flame className="w-5 h-5 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{totalWorkouts}</div>
                <div className="text-xs text-muted-foreground">Workouts</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
                <div className="text-2xl font-bold">{Math.round(totalVolume)}</div>
                <div className="text-xs text-muted-foreground">kg Volume</div>
              </div>
            </div>

            {/* Last 7 Days Chart */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Last 7 Days
              </h3>
              <div className="flex items-end justify-between gap-1 h-24">
                {last7Days.map((day, i) => {
                  const maxCount = Math.max(...last7Days.map(d => d.count), 1);
                  const height = (day.count / maxCount) * 100;
                  const dayName = format(new Date(day.date), 'EEE');
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex-1 flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(height, 5)}%` }}
                          className={cn(
                            'w-full rounded-t-sm',
                            day.count > 0 
                              ? 'bg-gradient-to-t from-primary to-primary/50'
                              : 'bg-muted'
                          )}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{dayName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal Records */}
            {personalRecords.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Personal Records
                </h3>
                <div className="space-y-2">
                  {personalRecords.slice(0, 5).map((pr) => (
                    <div
                      key={pr.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50"
                    >
                      <div>
                        <div className="font-medium text-sm">{pr.exerciseName}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(pr.date), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-primary">{pr.weight}kg</div>
                        {pr.reps && (
                          <div className="text-xs text-muted-foreground">{pr.reps} reps</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History List */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {Object.entries(groupedHistory).slice(0, 10).map(([date, items]) => (
                  <div key={date}>
                    <div className="text-sm text-muted-foreground mb-2">
                      {format(new Date(date), 'EEEE, MMM d')}
                    </div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {item.exerciseName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.sets} sets {item.weight ? `@ ${item.weight}kg` : ''}
                            </div>
                          </div>
                          {item.notes && (
                            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                              {item.notes}
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {history.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No workout history yet</p>
                    <p className="text-sm">Start tracking your workouts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
