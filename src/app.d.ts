// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				DB?: D1Database;
				[key: string]: any;
			};
		}
	}
}

// Cloudflare D1 types
interface D1Database {
	prepare(query: string): D1PreparedStatement;
	dump(): Promise<ArrayBuffer>;
	batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
	exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
	bind(...values: any[]): D1PreparedStatement;
	first(): Promise<any>;
	run(): Promise<D1Result>;
	all(): Promise<D1Result>;
}

interface D1Result {
	results?: any[];
	success: boolean;
	error?: string;
	meta: any;
}

interface D1ExecResult {
	count: number;
	duration: number;
}

export {};//svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
