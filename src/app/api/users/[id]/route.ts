import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';

// Define the expected context type based on the Vercel error log
type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Handles GET /api/users/:id
 * Fetches a single user by their ID.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // 1. Await the params promise to resolve
    const params = await context.params;
    const id = parseInt(params.id, 10);
    
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Handles PATCH /api/users/:id
 * Updates a single user's name.
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // 1. Await the params promise to resolve
    const params = await context.params;
    const id = parseInt(params.id, 10);
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const query = 'UPDATE users SET name = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [body.name, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Handles DELETE /api/users/:id
 * Deletes a single user by their ID.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // 1. Await the params promise to resolve
    const params = await context.params;
    const id = parseInt(params.id, 10);

    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}