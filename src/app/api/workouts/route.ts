import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workoutSessions } from '@/lib/workout-data';

// GET - Fetch all workouts with exercises
export async function GET() {
  try {
    let sessions = await db.workoutSession.findMany({
      include: {
        exercises: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    // If no sessions in DB, seed from workout-data
    if (sessions.length === 0) {
      for (const sessionData of workoutSessions) {
        const session = await db.workoutSession.create({
          data: {
            name: sessionData.name,
            code: sessionData.code,
            order: sessionData.order,
            exercises: {
              create: sessionData.exercises.map(ex => ({
                name: ex.name,
                type: ex.type,
                reps: ex.reps,
                setsTarget: ex.setsTarget,
                load: ex.load,
                rest: ex.rest,
                instructions: ex.instructions,
                avoid: ex.avoid,
                icon: ex.icon,
                order: ex.order
              }))
            }
          },
          include: { exercises: true }
        });
        sessions.push(session);
      }
    }

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST - Create or update exercise
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId, updates } = body;

    if (exerciseId) {
      const updated = await db.exercise.update({
        where: { id: exerciseId },
        data: updates
      });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, error: 'Missing exerciseId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update exercise' },
      { status: 500 }
    );
  }
}

// DELETE - Reset all workouts
export async function DELETE() {
  try {
    await db.workoutHistory.deleteMany();
    await db.exercise.deleteMany();
    await db.workoutSession.deleteMany();
    return NextResponse.json({ success: true, message: 'All workouts deleted' });
  } catch (error) {
    console.error('Error deleting workouts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete workouts' },
      { status: 500 }
    );
  }
}
