import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch workout history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');
    const days = searchParams.get('days');

    let where: Record<string, unknown> = {};
    
    if (exerciseId) {
      where.exerciseId = exerciseId;
    }

    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      where.completedAt = { gte: daysAgo };
    }

    const history = await db.workoutHistory.findMany({
      where,
      include: {
        exercise: {
          include: {
            session: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });

    // Calculate stats
    const totalWorkouts = await db.workoutHistory.groupBy({
      by: ['completedAt'],
      _count: true
    });

    // Get personal records
    const personalRecords = await db.personalRecord.findMany({
      orderBy: { date: 'desc' }
    });

    // Calculate streak (consecutive days with workouts)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const workoutsOnDay = await db.workoutHistory.findFirst({
        where: {
          completedAt: {
            gte: dayStart,
            lte: dayEnd
          }
        }
      });
      
      if (workoutsOnDay) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Last 7 days activity
    const last7Days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await db.workoutHistory.count({
        where: {
          completedAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        history,
        personalRecords,
        stats: {
          streak,
          totalWorkouts: history.length,
          last7Days
        }
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

// POST - Record workout completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId, sets, weight, notes, sessionId, exerciseName } = body;

    const history = await db.workoutHistory.create({
      data: {
        exerciseId,
        sets: sets || 1,
        weight,
        notes,
        sessionId
      }
    });

    // Check for personal record
    if (weight && exerciseName) {
      const existingPR = await db.personalRecord.findFirst({
        where: { exerciseName }
      });

      if (!existingPR || weight > existingPR.weight) {
        await db.personalRecord.upsert({
          where: {
            id: existingPR?.id || 'new'
          },
          create: {
            exerciseName,
            weight,
            reps: sets
          },
          update: {
            weight,
            reps: sets,
            date: new Date()
          }
        });
      }
    }

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Error recording workout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record workout' },
      { status: 500 }
    );
  }
}

// DELETE - Clear history
export async function DELETE() {
  try {
    await db.workoutHistory.deleteMany();
    return NextResponse.json({ success: true, message: 'History cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear history' },
      { status: 500 }
    );
  }
}
