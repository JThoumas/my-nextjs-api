// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // 1. Find the user in the database
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rowCount === 0) {
      // User not found. Send a generic error for security.
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    // 2. Compare the provided password with the stored hash
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      // Password doesn't match. Send the same generic error.
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. User is valid! Create a JWT
    const payload = {
      id: user.id,
      username: user.username,
    };
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in .env.local');
    }

    // Sign the token to expire in 1 hour
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // 4. Return the token to the client
    return NextResponse.json({ token });

  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}