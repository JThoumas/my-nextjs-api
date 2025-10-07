import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db'; // Import the connection pool

/**
 * Handles GET /api/users
 * Fetches all users from the database.
 */
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Handles POST /api/users
 * Creates a new user in the database.
 */
export async function POST(request: Request) {
  try {
    const newUser = await request.json();

    if (!newUser.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const query = 'INSERT INTO users (name) VALUES ($1) RETURNING *';
    const values = [newUser.name];
    
    const result = await pool.query(query, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error)
  {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}