import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db'; // Note the path is one level deeper

// Define a type for our route parameters
type Params = {
  params: {
    id: string;
  };
};

/**
 * Handles GET /api/users/:id
 * Fetches a single user by their ID.
 */
export async function GET(request: Request, { params }: Params) {
  try {
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
 * Updates a single user's name. (PATCH is for partial updates)
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
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
export async function DELETE(request: Request, { params }: Params) {
  try {
    const id = parseInt(params.id, 10);
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return a 204 No Content response on successful deletion
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}