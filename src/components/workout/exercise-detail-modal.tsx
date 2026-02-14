'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, Link2, Zap, User,
  X, AlertTriangle, ChevronRight, Save
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Exercise } from '@/store/workout-store';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
  onSave?: (exercise: Exercise, updates: { load?: string; notes?: string }) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dumbbell: Dumbbell,
  cable: Link2,
  barbell: Zap,
  body: User,
};

export function ExerciseDetailModal({ 
  exercise, 
  open, 
  onClose,
  onSave 
}: ExerciseDetailModalProps) {
  const [load, setLoad] = useState(exercise?.load || '');
  const [notes, setNotes] = useState('');

  if (!exercise) return null;

  const IconComponent = iconMap[exercise.icon || 'dumbbell'] || Dumbbell;

  const handleSave = () => {
    onSave?.(exercise, { load, notes });
    onClose();
  };

  const getTypeColor = () => {
    switch (exercise.type) {
      case 'strength':
        return 'bg-rose-500';
      case 'mobility':
        return 'bg-purple-500';
      case 'warmup':
        return 'bg-amber-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br',
              exercise.type === 'strength' && 'from-rose-500/20 to-orange-500/20',
              exercise.type === 'mobility' && 'from-purple-500/20 to-pink-500/20',
              exercise.type === 'warmup' && 'from-amber-500/20 to-yellow-500/20'
            )}>
              <IconComponent className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl">{exercise.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={cn('text-white', getTypeColor())}>
                  {exercise.type}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {exercise.setsTarget} sets × {exercise.reps || 'reps'}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Exercise Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <div className="text-2xl font-bold text-foreground">{exercise.setsTarget}</div>
              <div className="text-xs text-muted-foreground">Sets</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <div className="text-2xl font-bold text-foreground">{exercise.reps || '-'}</div>
              <div className="text-xs text-muted-foreground">Reps</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <div className="text-2xl font-bold text-foreground">{exercise.rest ? `${exercise.rest}s` : '-'}</div>
              <div className="text-xs text-muted-foreground">Rest</div>
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          {exercise.instructions && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" />
                Instructions
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                {exercise.instructions}
              </p>
            </div>
          )}

          {/* What to Avoid */}
          {exercise.avoid && (
            <div className="space-y-2">
              <h4 className="font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                What to Avoid
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                {exercise.avoid}
              </p>
            </div>
          )}

          <Separator />

          {/* Animation Placeholder */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Exercise Position</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-xl bg-muted/50 flex flex-col items-center justify-center p-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-2">
                  <IconComponent className="w-8 h-8 text-blue-500" />
                </div>
                <span className="text-xs text-muted-foreground">Start Position</span>
              </div>
              <div className="aspect-square rounded-xl bg-muted/50 flex flex-col items-center justify-center p-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-2">
                  <IconComponent className="w-8 h-8 text-emerald-500" />
                </div>
                <span className="text-xs text-muted-foreground">End Position</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Weight/Load Adjustment */}
          <div className="space-y-3">
            <Label htmlFor="load" className="font-semibold">Weight / Load</Label>
            <Input
              id="load"
              value={load}
              onChange={(e) => setLoad(e.target.value)}
              placeholder="e.g., 45kg"
              className="text-lg"
            />
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="font-semibold">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this exercise..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
