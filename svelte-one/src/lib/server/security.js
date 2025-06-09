// filepath: src/lib/server/security.js
/**
 * Simple rate limiter for API endpoints
 * In a production environment, you would use a more robust solution
 * like Redis for distributed rate limiting
 */

// In-memory store for rate limiting
const rateLimit = new Map();

/**
 * Rate limiting middleware
 * @param {string} key - Unique identifier (IP address, user ID, etc.)
 * @param {number} limit - Maximum requests allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if rate limit is not exceeded, false otherwise
 */
export function checkRateLimit(key, limit = 10, windowMs = 60000) {
	// Get current time
	const now = Date.now();

	// Get existing record or create new one
	const record = rateLimit.get(key) || {
		requests: 0,
		resetTime: now + windowMs
	};

	// Reset if the window has expired
	if (now > record.resetTime) {
		record.requests = 0;
		record.resetTime = now + windowMs;
	}

	// Increment request count
	record.requests += 1;

	// Update rate limit record
	rateLimit.set(key, record);

	// Check if rate limit is exceeded
	return record.requests <= limit;
}

/**
 * Get remaining requests allowed for a key
 * @param {string} key - Unique identifier
 * @returns {Object} - Remaining requests and reset time
 */
export function getRateLimitInfo(key) {
	const record = rateLimit.get(key);

	if (!record) {
		return { remaining: Infinity, resetTime: Date.now() };
	}

	return {
		remaining: Math.max(0, 10 - record.requests),
		resetTime: record.resetTime
	};
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupRateLimits() {
	const now = Date.now();

	for (const [key, record] of rateLimit.entries()) {
		if (now > record.resetTime) {
			rateLimit.delete(key);
		}
	}
}

// Set up periodic cleanup (every 15 minutes)
setInterval(cleanupRateLimits, 15 * 60 * 1000);

/**
 * Create Content Security Policy headers
 * @returns {string} - CSP header value
 */
export function getContentSecurityPolicy() {
	return [
		"default-src 'self'",
		"img-src 'self' https://laufplanerpro.de data:",
		"script-src 'self' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline'",
		"connect-src 'self'",
		"font-src 'self'",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'"
	].join('; ');
}

/**
 * Get security headers for responses
 * @returns {Object} - Security headers
 */
export function getSecurityHeaders() {
	return {
		'Content-Security-Policy': getContentSecurityPolicy(),
		'X-Content-Type-Options': 'nosniff',
		'X-Frame-Options': 'DENY',
		'X-XSS-Protection': '1; mode=block',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
	};
}
