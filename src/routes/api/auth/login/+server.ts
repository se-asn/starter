// User login endpoint
// src/routes/api/auth/login/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { verifyPassword, createToken, isValidEmail } from '$lib/server/auth';
import type { AuthUser } from '$lib/server/auth';
import { findUserByEmail, createMockToken, isValidMockPassword } from '$lib/server/mock-auth';

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = (platform as any)?.env?.DB;    if (!db) {
      console.log('Database not available, using simple mock auth');
      
      // Ultra-simple mock authentication for Cloudflare Pages
      // Allow any email/password combination for demo
      if (email && password && password.length >= 6) {
        const userId = crypto.randomUUID();
        const user = { id: userId, email, name: email.split('@')[0] };
        
        // Create a simple token
        const tokenPayload = { id: userId, email, name: user.name, exp: Date.now() + 24*60*60*1000 };
        const token = btoa(JSON.stringify(tokenPayload));
        
        console.log('Mock login successful:', { email });
        
        return json({
          success: true,
          message: 'Login successful (demo mode)',
          user: {
            id: userId,
            email,
            name: user.name
          },
          token
        });
      }
      
      return json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    try {
      // Find user by email
      const user = await db.prepare(
        'SELECT id, email, name, password_hash FROM athletes WHERE email = ?'
      ).bind(email).first() as AuthUser | null;

      if (!user) {
        return json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password
      const passwordValid = await verifyPassword(password, user.password_hash);
      if (!passwordValid) {
        return json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Create JWT token
      const token = await createToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      return json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });

    } catch (dbError) {
      console.error('Database error, falling back to mock auth:', dbError);
      
      // Fallback to mock auth
      if (email === 'demo@triathlon.com' && isValidMockPassword(password)) {
        const user = findUserByEmail(email);
        if (user) {
          const token = createMockToken(user);
          return json({
            success: true,
            message: 'Login successful (demo mode)',
            user: {
              id: user.id,
              email: user.email,
              name: user.name
            },
            token
          });
        }
      }
      
      return json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
};
