// src/app/api/me/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { pool } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // 1. Get the user payload that the middleware attached
    const userPayloadHeader = request.headers.get('X-User-Payload');

    if (!userPayloadHeader) {
      // This should technically be caught by middleware, but good to double-check
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const user = JSON.parse(userPayloadHeader);

    // 2. Fetch the user's details from the database (optional but good practice)
    // This ensures the user still exists
    const result = await pool.query('SELECT id, username, created_at FROM users WHERE id = $1', [user.id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Return the user's data
    return NextResponse.json(result.rows[0]);
    
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}