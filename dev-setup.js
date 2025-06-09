// Development Setup für lokale D1 Database
// dev-setup.js

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Starting Development Setup...');

// Check if .wrangler directory exists (local D1 database)
const wranglerDir = '.wrangler/state/v3/d1';
if (!existsSync(wranglerDir)) {
  console.log('📦 Initializing local D1 database...');
  try {
    // Create local database if it doesn't exist
    execSync('npx wrangler d1 execute training_plans_db --local --command="SELECT 1;"', { stdio: 'inherit' });
    console.log('✅ Local D1 database initialized');
  } catch (error) {
    console.log('ℹ️  Local D1 database already exists or will be created on first use');
  }
}

// Ensure database schema is applied locally
console.log('🗄️  Checking database schema...');
try {
  execSync('npx wrangler d1 execute training_plans_db --local --file=./database-schema.sql', { stdio: 'pipe' });
  console.log('✅ Database schema applied');
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('ℹ️  Database schema already exists');
  } else {
    console.log('⚠️  Schema warning (tables might already exist)');
  }
}

console.log('🎉 Development setup complete!');
console.log('');
console.log('💡 Note: Use --remote flag to work with production database');
console.log('   Local:  npx wrangler d1 execute training_plans_db --local');
console.log('   Remote: npx wrangler d1 execute training_plans_db --remote');
