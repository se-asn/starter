// Test Database Connection
// src/routes/api/test/database/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ platform }) => {
  try {
    // Check if DB is available
    if (!platform?.env?.DB) {
      return json(
        { error: 'Database not available', available: false },
        { status: 500 }
      );
    }

    const db = platform.env.DB;

    // Test database connection by checking tables
    const tables = await db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
    `).all();

    // Count records in each table
    const tableCounts: Record<string, number | string> = {};
    
    for (const table of (tables.results || [])) {
      if (table.name !== '_cf_METADATA') {
        try {
          const count = await db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).first();
          tableCounts[table.name] = count?.count || 0;
        } catch (e) {
          tableCounts[table.name] = 'error';
        }
      }
    }

    // Get database info
    const dbInfo = await db.prepare(`PRAGMA database_list;`).all();

    return json({
      success: true,
      message: 'Database connection successful!',
      database: {
        available: true,
        tables: (tables.results || []).map((t: any) => t.name),
        recordCounts: tableCounts,
        info: dbInfo.results
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Database test error:', error);
    
    return json(
      {
        error: 'Database connection failed',
        details: error?.message || 'Unknown error',
        available: false
      },
      { status: 500 }
    );
  }
};
