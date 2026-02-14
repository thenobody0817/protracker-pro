'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, Vibrate, Timer, Palette, Check } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useWorkoutStore } from '@/store/workout-store';
import { cn } from '@/lib/utils';

const themes = [
  { 
    id: 'glass' as const, 
    name: 'Glass', 
    description: 'Frosted glass effect',
    preview: 'bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl'
  },
  { 
    id: 'midnight' as const, 
    name: 'Midnight', 
    description: 'Dark with purple accents',
    preview: 'bg-gradient-to-br from-purple-900 to-slate-900'
  },
  { 
    id: 'light' as const, 
    name: 'Light', 
    description: 'Clean and bright',
    preview: 'bg-gradient-to-br from-slate-100 to-white'
  },
  { 
    id: 'cyber' as const, 
    name: 'Cyber', 
    description: 'Matrix-style green',
    preview: 'bg-gradient-to-br from-black to-emerald-950'
  },
];

export function SettingsPanel() {
  const { settings, setSettings, setTheme } = useWorkoutStore();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Theme Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Theme
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTheme(theme.id)}
                  className={cn(
                    'relative p-4 rounded-xl border-2 transition-all duration-300 text-left',
                    'hover:shadow-lg',
                    settings.theme === theme.id 
                      ? 'border-primary shadow-lg shadow-primary/20' 
                      : 'border-border/50 hover:border-primary/50'
                  )}
                >
                  {settings.theme === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </motion.div>
                  )}
                  <div className={cn(
                    'w-full h-16 rounded-lg mb-3',
                    theme.preview
                  )} />
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-xs text-muted-foreground">{theme.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sound Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              Sound
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
              <div>
                <Label htmlFor="sound">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sound when timer ends</p>
              </div>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => setSettings({ soundEnabled: checked })}
              />
            </div>
          </div>

          {/* Vibration Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Vibrate className="w-4 h-4" />
              Haptic Feedback
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
              <div>
                <Label htmlFor="vibration">Vibration</Label>
                <p className="text-sm text-muted-foreground">Vibrate on interactions</p>
              </div>
              <Switch
                id="vibration"
                checked={settings.vibrationEnabled}
                onCheckedChange={(checked) => setSettings({ vibrationEnabled: checked })}
              />
            </div>
          </div>

          {/* Timer Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Default Rest Timer
            </h3>
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <Label>Rest Duration</Label>
                <span className="font-mono font-bold text-primary">{settings.defaultRestTime}s</span>
              </div>
              <Slider
                value={[settings.defaultRestTime]}
                onValueChange={([value]) => setSettings({ defaultRestTime: value })}
                min={30}
                max={300}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>30s</span>
                <span>5min</span>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
            <p>ProTracker Pro v1.0.0</p>
            <p className="text-xs mt-1">Your fitness journey, tracked.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
