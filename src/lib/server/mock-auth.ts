// Mock authentication for development
// src/lib/server/mock-auth.ts

export interface MockUser {
  id: string;
  email: string;
  name: string;
}

// Simple in-memory user store for development
const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'demo@triathlon.com',
    name: 'Demo Athlete'
  }
];

let mockTokens: { [token: string]: MockUser } = {};

export function findUserByEmail(email: string): MockUser | null {
  return mockUsers.find(user => user.email === email) || null;
}

export function createMockUser(email: string, name: string): MockUser {
  const user: MockUser = {
    id: Date.now().toString(),
    email,
    name
  };
  mockUsers.push(user);
  return user;
}

export function createMockToken(user: MockUser): string {
  const token = `mock_${Date.now()}_${user.id}`;
  mockTokens[token] = user;
  return token;
}

export function verifyMockToken(token: string): MockUser | null {
  return mockTokens[token] || null;
}

export function isValidMockPassword(password: string): boolean {
  // Simple validation for demo
  return password.length >= 6;
}
