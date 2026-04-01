const { Pool } = require('pg');

let pool = null;

/**
 * Creates a new PostgreSQL connection pool with retry logic.
 * @returns {Promise<Pool>} The connection pool.
 */
async function createPoolWithRetry() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required but not set.');
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const newPool = new Pool({
        connectionString: databaseUrl,
        // Optional: adjust pool size etc.
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test the connection
      await newPool.query('SELECT 1');
      console.log(`PostgreSQL connection pool created successfully on attempt ${attempt}`);
      return newPool;
    } catch (err) {
      lastError = err;
      console.warn(`PostgreSQL connection attempt ${attempt} failed:`, err.message);
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
      }
    }
  }
  throw new Error(`Failed to connect to PostgreSQL after 3 attempts. Last error: ${lastError.message}`);
}

/**
 * Initializes the database connection pool.
 * Should be called once at application startup.
 * @returns {Promise<void>}
 */
async function connectDB() {
  if (pool) {
    console.warn('Database connection pool already initialized.');
    return;
  }
  pool = await createPoolWithRetry();
}

/**
 * Closes the database connection pool.
 * Should be called on application shutdown.
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  if (!pool) {
    console.warn('Database connection pool is not initialized.');
    return;
  }
  await pool.end();
  pool = null;
  console.log('PostgreSQL connection pool closed.');
}

/**
 * Performs a health check on the database connection.
 * @returns {Promise<Object>} Health check result.
 */
async function healthCheck() {
  if (!pool) {
    return { status: 'error', message: 'Database connection pool not initialized.' };
  }
  try {
    const start = Date.now();
    const res = await pool.query('SELECT 1 AS health');
    const latency = Date.now() - start;
    return {
      status: 'ok',
      message: 'Database is healthy.',
      latencyMs: latency,
      result: res.rows[0],
    };
  } catch (err) {
    return {
      status: 'error',
      message: 'Database health check failed.',
      error: err.message,
    };
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  healthCheck,
};