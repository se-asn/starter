// Legacy Database Wrapper - Migrated to Supabase
// src/lib/server/database.ts

import { serverDb } from './supabase-server';

// Export server database for backwards compatibility
export { serverDb };

// Legacy warning for old imports
export const database = {
  warn: () => console.warn('⚠️ Legacy database import - use supabase-server.ts instead')
};

export default database;