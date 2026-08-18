let poolInstance: any = null;
let isConnected = false;
let connectionAttempted = false;

export function getDatabasePool(): any {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  if (!poolInstance) {
    try {
      // Dynamic require so build succeeds cleanly even in lightweight environments
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Pool } = require('pg');
      poolInstance = new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
        max: 10,
      });

      poolInstance.on('error', (err: any) => {
        console.error('[PostgreSQL Pool Error]:', err?.message || err);
        isConnected = false;
      });
    } catch (e: any) {
      console.warn('[PostgreSQL Initialization Warning]:', e?.message || e);
      return null;
    }
  }

  return poolInstance;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  const dbPool = getDatabasePool();
  if (!dbPool) {
    isConnected = false;
    connectionAttempted = true;
    return false;
  }

  try {
    const client = await dbPool.connect();
    try {
      const res = await client.query('SELECT 1 as test');
      isConnected = res && res.rows && res.rows.length > 0;
      connectionAttempted = true;
      return isConnected;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('[PostgreSQL Connection Check]: Database unavailable, using in-memory fallback. Reason:', err?.message || err);
    isConnected = false;
    connectionAttempted = true;
    return false;
  }
}

export async function executeQuery<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number } | null> {
  const dbPool = getDatabasePool();
  if (!dbPool) return null;

  try {
    const client = await dbPool.connect();
    try {
      const result = await client.query(text, params);
      return { rows: result.rows, rowCount: result.rowCount || 0 };
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('[PostgreSQL Query Error]: Query failed, falling back to static repository. Reason:', err?.message || err);
    return null;
  }
}

export function isPostgresActive(): boolean {
  return Boolean(process.env.DATABASE_URL) && isConnected;
}
