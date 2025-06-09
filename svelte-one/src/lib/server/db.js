// Database adapter for Cloudflare D1
// This file provides an abstraction layer for database operations

/**
 * Training plans database adapter for Cloudflare D1
 * @param {Object} env - The environment object containing the DB binding
 */
export class TrainingPlanDb {
	constructor(env) {
		this.db = env.DB;
	}

	// User Training Plans operations
	async getUserTrainingPlans(userId = null) {
		try {
			let query = 'SELECT * FROM user_training_plans';
			let params = [];

			if (userId) {
				query += ' WHERE userId = ?';
				params.push(userId);
			}

			const { results } = await this.db
				.prepare(query)
				.bind(...params)
				.all();

			// Parse JSON fields
			return results.map((plan) => ({
				...plan,
				progress: plan.progress ? JSON.parse(plan.progress) : {}
			}));
		} catch (error) {
			console.error('Error fetching user training plans:', error);
			throw error;
		}
	}

	async getUserTrainingPlan(userId, planId) {
		try {
			const { results } = await this.db
				.prepare('SELECT * FROM user_training_plans WHERE userId = ? AND planId = ?')
				.bind(userId, planId)
				.all();

			if (results.length === 0) return null;

			// Parse JSON fields
			const plan = results[0];
			return {
				...plan,
				progress: plan.progress ? JSON.parse(plan.progress) : {}
			};
		} catch (error) {
			console.error('Error fetching user training plan:', error);
			throw error;
		}
	}

	async addUserTrainingPlan(userPlan) {
		try {
			// Convert objects to JSON strings for storage
			const progress = JSON.stringify(userPlan.progress || {});

			const result = await this.db
				.prepare(
					`
          INSERT INTO user_training_plans 
          (userId, planId, userEmail, userName, startDate, targetDate, targetEvent, currentWeek, isActive, progress)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
				)
				.bind(
					userPlan.userId,
					userPlan.planId,
					userPlan.userEmail || '',
					userPlan.userName || '',
					userPlan.startDate,
					userPlan.targetDate || '',
					userPlan.targetEvent || '',
					userPlan.currentWeek || 1,
					userPlan.isActive ? 1 : 0,
					progress
				)
				.run();

			return result.success;
		} catch (error) {
			console.error('Error adding user training plan:', error);
			throw error;
		}
	}

	async updateUserTrainingPlan(userId, planId, updates) {
		try {
			// Build the SET clause dynamically based on provided updates
			const setClauses = [];
			const params = [];

			Object.entries(updates).forEach(([key, value]) => {
				if (key === 'progress') {
					setClauses.push(`${key} = ?`);
					params.push(JSON.stringify(value));
				} else if (key === 'isActive') {
					setClauses.push(`${key} = ?`);
					params.push(value ? 1 : 0);
				} else {
					setClauses.push(`${key} = ?`);
					params.push(value);
				}
			});

			// Add WHERE clause parameters
			params.push(userId, planId);

			const result = await this.db
				.prepare(
					`
          UPDATE user_training_plans 
          SET ${setClauses.join(', ')}
          WHERE userId = ? AND planId = ?
        `
				)
				.bind(...params)
				.run();

			return result.success;
		} catch (error) {
			console.error('Error updating user training plan:', error);
			throw error;
		}
	}

	async deleteUserTrainingPlan(userId, planId) {
		try {
			const result = await this.db
				.prepare('DELETE FROM user_training_plans WHERE userId = ? AND planId = ?')
				.bind(userId, planId)
				.run();

			return result.success;
		} catch (error) {
			console.error('Error deleting user training plan:', error);
			throw error;
		}
	}

	// Training Plans operations (available plans)
	async getTrainingPlans() {
		try {
			const { results } = await this.db.prepare('SELECT * FROM training_plans').all();

			// Parse JSON fields
			return results.map((plan) => ({
				...plan,
				weeks: plan.weeks ? JSON.parse(plan.weeks) : []
			}));
		} catch (error) {
			console.error('Error fetching training plans:', error);
			throw error;
		}
	}

	async getTrainingPlan(planId) {
		try {
			const { results } = await this.db
				.prepare('SELECT * FROM training_plans WHERE id = ?')
				.bind(planId)
				.all();

			if (results.length === 0) return null;

			// Parse JSON fields
			const plan = results[0];
			return {
				...plan,
				weeks: plan.weeks ? JSON.parse(plan.weeks) : []
			};
		} catch (error) {
			console.error('Error fetching training plan:', error);
			throw error;
		}
	}

	// Initial database setup
	async migrateDatabase() {
		try {
			// Create tables if they don't exist
			await this.db.exec(`
        CREATE TABLE IF NOT EXISTS user_training_plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          planId TEXT NOT NULL,
          userEmail TEXT,
          userName TEXT,
          startDate TEXT NOT NULL,
          targetDate TEXT,
          targetEvent TEXT,
          currentWeek INTEGER DEFAULT 1,
          isActive INTEGER DEFAULT 1,
          progress TEXT,
          UNIQUE(userId, planId)
        );
        
        CREATE TABLE IF NOT EXISTS training_plans (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          distance TEXT NOT NULL,
          level TEXT NOT NULL,
          duration TEXT NOT NULL,
          description TEXT,
          thumbnailUrl TEXT,
          price TEXT,
          weeks TEXT
        );
      `);

			console.log('Database migration completed successfully');
			return true;
		} catch (error) {
			console.error('Error migrating database:', error);
			throw error;
		}
	}

	// Seed initial data (for development/testing)
	async seedTrainingPlansData(availableTrainingPlans) {
		try {
			// First check if there's already data to avoid duplicates
			const { results } = await this.db
				.prepare('SELECT COUNT(*) as count FROM training_plans')
				.all();

			if (results[0].count > 0) {
				console.log('Training plans data already exists, skipping seed');
				return false;
			}

			// Insert each training plan
			for (const plan of availableTrainingPlans) {
				// Convert weeks array to JSON string
				const weeks = JSON.stringify(plan.weeks || []);

				await this.db
					.prepare(
						`
            INSERT INTO training_plans
            (id, title, distance, level, duration, description, thumbnailUrl, price, weeks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `
					)
					.bind(
						plan.id,
						plan.title,
						plan.distance,
						plan.level,
						plan.duration,
						plan.description || '',
						plan.thumbnailUrl || '',
						plan.price || '',
						weeks
					)
					.run();
			}

			console.log('Training plans data seeded successfully');
			return true;
		} catch (error) {
			console.error('Error seeding training plans data:', error);
			throw error;
		}
	}

	async seedUserTrainingPlansData(userTrainingPlans) {
		try {
			// First check if there's already data to avoid duplicates
			const { results } = await this.db
				.prepare('SELECT COUNT(*) as count FROM user_training_plans')
				.all();

			if (results[0].count > 0) {
				console.log('User training plans data already exists, skipping seed');
				return false;
			}

			// Insert each user training plan
			for (const plan of userTrainingPlans) {
				// Convert progress object to JSON string
				const progress = JSON.stringify(plan.progress || {});

				await this.db
					.prepare(
						`
            INSERT INTO user_training_plans
            (userId, planId, userEmail, userName, startDate, targetDate, targetEvent, currentWeek, isActive, progress)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `
					)
					.bind(
						plan.userId,
						plan.planId,
						plan.userEmail || '',
						plan.userName || '',
						plan.startDate,
						plan.targetDate || '',
						plan.targetEvent || '',
						plan.currentWeek || 1,
						plan.isActive ? 1 : 0,
						progress
					)
					.run();
			}

			console.log('User training plans data seeded successfully');
			return true;
		} catch (error) {
			console.error('Error seeding user training plans data:', error);
			throw error;
		}
	}
}
