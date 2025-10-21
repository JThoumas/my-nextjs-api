// src/app/api/tasks/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { pool } from '../../../lib/db';

/**
 * Helper function to get the user ID from the request headers
 * The 'X-User-Payload' header is set by our middleware
 */
function getUserIdFromRequest(request: NextRequest): number | null {
  const userPayloadHeader = request.headers.get('X-User-Payload');
  if (!userPayloadHeader) {
    return null;
  }
  try {
    const user = JSON.parse(userPayloadHeader);
    return user.id;
  } catch (error) {
    return null;
  }
}

/**
 * GET /api/tasks
 * Fetches all tasks for the currently logged-in user.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    // Query to select tasks ONLY where the user_id matches
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/tasks
 * Creates a new task for the currently logged-in user.
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { title } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Query to insert a new task, explicitly setting the user_id
    const query = 'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [title, userId]);

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}