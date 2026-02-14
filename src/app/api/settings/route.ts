import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch user settings
export async function GET() {
  try {
    let settings = await db.userSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await db.userSettings.create({
        data: {
          id: 'default',
          theme: 'glass',
          soundEnabled: true,
          defaultRestTime: 90,
          vibrationEnabled: true
        }
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme, soundEnabled, defaultRestTime, vibrationEnabled } = body;

    const settings = await db.userSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        theme: theme || 'glass',
        soundEnabled: soundEnabled ?? true,
        defaultRestTime: defaultRestTime ?? 90,
        vibrationEnabled: vibrationEnabled ?? true
      },
      update: {
        ...(theme !== undefined && { theme }),
        ...(soundEnabled !== undefined && { soundEnabled }),
        ...(defaultRestTime !== undefined && { defaultRestTime }),
        ...(vibrationEnabled !== undefined && { vibrationEnabled })
      }
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
