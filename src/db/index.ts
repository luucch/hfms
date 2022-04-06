import { createPool, PoolConnection } from 'mysql2/promise';

const pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'hfms',
});

if (process.env.QUERY_DEBUG === 'true') {
  // get acquired connection id
  pool.on('acquire', (connection) => {
    console.log('Connection %d acquired', connection.threadId);
  });

  // check released connection
  pool.on('release', (connection) => {
    console.log('Connection %d released', connection.threadId);
  });

  pool.on('enqueue', () => {
    console.log('Waiting for available connection slot');
  });
}

const run = async (fn: any) => {
  const con: PoolConnection = await pool.getConnection();
  const [rows] = await fn(con).catch((error: any) => {
    con.release();
    throw error;
  });

  con.release();
  return rows;
};

const transaction = async (fn: any) => {
  const con: PoolConnection = await pool.getConnection();
  await con.beginTransaction();
  const [rows] = await fn(con).catch(async (error: any) => {
    await con.rollback();
    con.release();
    throw error;
  });

  await con.commit();
  con.release();
  return rows;
};

const queryLog = (query: string) => {
  if (process.env.QUERY_DEBUG === 'true') {
    console.log(`[${new Date().toLocaleString()}] ${query}`);
  }
};

const close = () => {
  pool.end();
};

export default {
  run,
  transaction,
  queryLog,
  close,
};
