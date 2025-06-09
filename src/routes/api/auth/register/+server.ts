// User registration endpoint
// src/routes/api/auth/register/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { hashPassword, createToken, isValidEmail, isValidPassword } from '$lib/server/auth';
import { createMockUser, createMockToken, findUserByEmail } from '$lib/server/mock-auth';

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }    // Check if database is available
    const db = (platform as any)?.env?.DB;
    
    if (!db) {
      console.log('Database not available, using mock auth');
      
      // Use mock authentication
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        return json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      const user = createMockUser(email, name);
      const token = createMockToken(user);

      return json({
        success: true,
        message: 'User registered successfully (demo mode)',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    }

    try {
      // Check if user already exists
      const existingUser = await db.prepare(
        'SELECT id FROM athletes WHERE email = ?'
      ).bind(email).first();

      if (existingUser) {
        return json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const userId = crypto.randomUUID();
      const now = new Date().toISOString();

      await db.prepare(`
        INSERT INTO athletes (
          id, email, name, password_hash, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).bind(userId, email, name, passwordHash, now, now).run();

      // Create JWT token
      const token = await createToken({
        id: userId,
        email,
        name
      });

      return json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: userId,
          email,
          name
        },
        token
      });

    } catch (dbError) {
      console.error('Database error, falling back to mock auth:', dbError);
      
      // Fallback to mock auth if database fails
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        return json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      const user = createMockUser(email, name);
      const token = createMockToken(user);

      return json({
        success: true,
        message: 'User registered successfully (demo mode)',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    return json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
};
