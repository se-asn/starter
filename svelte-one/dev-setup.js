// dev-setup.js
// Local development setup script for testing without Cloudflare authentication

import { runMigrations } from './migrations.js';

// Mock environment for local development
const mockEnv = {
    DB: {
        // Mock D1 database interface
        prepare: (query) => ({
            bind: (...params) => ({
                all: async () => ({ results: [], success: true }),
                first: async () => null,
                run: async () => ({ success: true, meta: { changes: 0 } })
            }),
            all: async () => ({ results: [], success: true }),
            first: async () => null,
            run: async () => ({ success: true, meta: { changes: 0 } })
        }),
        batch: async (statements) => ({ success: true, results: [] }),
        exec: async (query) => ({ success: true, results: [] })
    }
};

console.log('🏠 Local development setup');
console.log('📋 Demo credentials:');
console.log('   Email: demo@example.com');
console.log('   Password: demo123');
console.log('');
console.log('📋 Admin credentials:');
console.log('   Email: admin@example.com');
console.log('   Password: admin123');
console.log('');
console.log('ℹ️  The application will run with in-memory data when D1 is not available.');
console.log('🚀 Starting development server...');
