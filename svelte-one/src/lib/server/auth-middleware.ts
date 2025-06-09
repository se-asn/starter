// Authentication middleware utilities
// src/lib/server/auth-middleware.ts

import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { verifyToken, extractTokenFromHeader } from './auth';
import type { UserPayload } from './auth';
import { verifyMockToken } from './mock-auth';

/**
 * Middleware to authenticate requests
 */
export async function authenticateRequest(event: RequestEvent): Promise<UserPayload | Response> {
  const authorization = event.request.headers.get('authorization');
  const token = extractTokenFromHeader(authorization);

  if (!token) {
    return json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Try mock token first (for development)
  if (token.startsWith('mock_')) {
    const mockUser = verifyMockToken(token);
    if (mockUser) {
      return {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name
      };
    }
  }

  // Try JWT token
  const user = await verifyToken(token);
  if (!user) {
    return json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  return user;
}

/**
 * Extract user from authenticated request
 */
export async function getAuthenticatedUser(event: RequestEvent): Promise<UserPayload | null> {
  const authorization = event.request.headers.get('authorization');
  const token = extractTokenFromHeader(authorization);

  if (!token) return null;

  // Try mock token first (for development)
  if (token.startsWith('mock_')) {
    const mockUser = verifyMockToken(token);
    if (mockUser) {
      return {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name
      };
    }
  }

  return await verifyToken(token);
}
