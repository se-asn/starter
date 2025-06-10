// Client-side mock authentication for GitHub Pages
// src/lib/client-auth.ts

export interface User {
  id: string;
  email: string;
  name: string;
}

// Demo users for GitHub Pages (client-side only)
const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'demo123'
  },
  {
    id: '2', 
    email: 'athlete@example.com',
    name: 'Elite Athlete',
    password: 'athlete123'
  },
  {
    id: '3',
    email: 'trainer@example.com', 
    name: 'Neural Trainer',
    password: 'trainer123'
  }
];

export class ClientAuth {
  
  static login(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const user = DEMO_USERS.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          const token = btoa(JSON.stringify({ ...userWithoutPassword, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
          
          resolve({
            success: true,
            user: userWithoutPassword,
            token,
            message: 'Neural link established successfully'
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid neural credentials detected'
          });
        }
      }, 800); // Simulate loading
    });
  }

  static register(email: string, password: string, name: string): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = DEMO_USERS.find(u => u.email === email);
        
        if (existingUser) {
          resolve({
            success: false,
            message: 'Neural profile already exists for this identity'
          });
          return;
        }

        // Create new user
        const newUser: User = {
          id: String(DEMO_USERS.length + 1),
          email,
          name
        };

        const token = btoa(JSON.stringify({ ...newUser, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
        
        // In a real app, this would be saved to a database
        DEMO_USERS.push({ ...newUser, password });
        
        resolve({
          success: true,
          user: newUser,
          token,
          message: 'Neural profile registered successfully'
        });
      }, 1000);
    });
  }

  static verifyToken(token: string): User | null {
    try {
      const decoded = JSON.parse(atob(token));
      
      // Check if token is expired
      if (decoded.exp < Date.now()) {
        return null;
      }
      
      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      };
    } catch {
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  static getCurrentUser(): User | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    return this.verifyToken(token);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
