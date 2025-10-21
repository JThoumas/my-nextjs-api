import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import bcrypt from 'bcrypt';

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
 * Handles POST /api/users for user signup
 */
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *';
    const values = [username, password_hash];
    
    const result = await pool.query(query, values);
    const newUser = result.rows[0];

    // CRITICAL: Never return the password hash in the API response.
    delete newUser.password_hash;

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    // Check for the unique constraint violation
    if (error.code === '23505') { // 23505 is the code for unique_violation
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 }); // 409 Conflict
    }
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}