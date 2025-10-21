// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // A more modern library for JWT verification

// This function can be marked 'async' if using 'await' inside
export async function middleware(request: NextRequest) {
  // 1. Get the token from the request's "Authorization" header
  const authHeader = request.headers.get('Authorization');
  
  // 2. Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header required' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1]; // Get the token part

  // 3. Get the JWT_SECRET from environment variables
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in .env.local');
  }
  const secretEncoded = new TextEncoder().encode(secret);

  try {
    // 4. Verify the token
    // We use 'jose' here as 'jsonwebtoken' can be tricky in edge environments
    const { payload } = await jwtVerify(token, secretEncoded);

    // 5. Token is valid! Attach the payload to the request
    // Create a new header so the API route can access the user info
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Payload', JSON.stringify(payload));

    // 6. Continue to the requested API route
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    // 7. Token is invalid or expired
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

// 8. Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all API routes except for /api/login and /api/users (signup)
     * This uses a negative lookahead regex
     */
    '/api/((?!login|users).*)',
  ],
};