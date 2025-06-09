// Mock authentication for development
// src/lib/server/mock-auth.ts

export interface MockUser {
  id: string;
  email: string;
  name: string;
}

// Type extension for globalThis
declare global {
  var mockUsers: MockUser[] | undefined;
  var mockTokens: { [token: string]: MockUser } | undefined;
}

// Simple in-memory user store for development and fallback
const defaultUsers: MockUser[] = [
  {
    id: '1',
    email: 'demo@triathlon.com',
    name: 'Demo Athlete'
  }
];

// Use globalThis to persist data across requests in Cloudflare Workers
if (typeof globalThis !== 'undefined') {
  if (!globalThis.mockUsers) {
    globalThis.mockUsers = [...defaultUsers];
  }
  if (!globalThis.mockTokens) {
    globalThis.mockTokens = {};
  }
} else {
  // Fallback for environments where globalThis is not available
  globalThis.mockUsers = [...defaultUsers];
  globalThis.mockTokens = {};
}

export function findUserByEmail(email: string): MockUser | null {
  const users = globalThis?.mockUsers || defaultUsers;
  return users.find(user => user.email === email) || null;
}

export function createMockUser(email: string, name: string): MockUser {
  const user: MockUser = {
    id: Date.now().toString(),
    email,
    name
  };
  
  // Add to global storage for Cloudflare Workers
  if (globalThis?.mockUsers) {
    globalThis.mockUsers.push(user);
  }
  
  return user;
}

export function createMockToken(user: MockUser): string {
  const token = `mock_${Date.now()}_${user.id}`;
  
  // Store in global storage for Cloudflare Workers
  if (globalThis?.mockTokens) {
    globalThis.mockTokens[token] = user;
  }
  
  return token;
}

export function verifyMockToken(token: string): MockUser | null {
  const tokens = globalThis?.mockTokens || {};
  return tokens[token] || null;
}

export function isValidMockPassword(password: string): boolean {
  // Simple validation for demo
  return password.length >= 6;
}
