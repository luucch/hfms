import mysql2 from '../db';
import { PoolConnection } from 'mysql2/promise';
import { TABLE_LIST } from '../models/tables.model';


export const findAll = async <T>(table: TABLE_LIST): Promise<T[]> => {
  const SQL = `SELECT * FROM \`${table}\` ORDER BY createdAt DESC`;

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL);
    mysql2.queryLog(query);
    return con.query(query);
  });
};

export const find = async <T>(
  table: TABLE_LIST,
  q: {
    [key: string]: string;
  },
  condition = 'or',
): Promise<T[]> => {
  const operator: any = {
    or: '||',
    and: '&&',
  };
  const queries = Object.keys(q)
    .map((key: string) => `\`${key}\` = ?`)
    .join(operator[condition]);
  const values = Object.values(q);

  const SQL = `SELECT * FROM \`${table}\` WHERE ${queries} ORDER BY createdAt DESC`;

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, values);
    mysql2.queryLog(query);
    return con.query(query);
  });
};

export const findByQuery = async <T>(
  table: TABLE_LIST,
  query: string,
): Promise<T[]> => {
  const SQL = `SELECT * FROM \`${table}\` WHERE ${query}`;

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL);
    mysql2.queryLog(query);
    return con.query(query);
  });
};

export const findById = async <T>(
  table: TABLE_LIST,
  id: string,
  addQuery = '',
): Promise<T> => {
  const SQL = `SELECT * FROM \`${table}\` WHERE id = ? ${addQuery}`;

  const result = await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [id]);
    mysql2.queryLog(query);
    return con.query(query);
  });
  console.log(result);

  if (result.length) {
    return result[0];
  }

  throw new Error('No record found');
};

export const findByIds = async <T>(
  table: TABLE_LIST,
  ids: string[],
  addQuery = '',
): Promise<T[]> => {
  const SQL = `SELECT * FROM \`${table}\` WHERE id IN (?) ${addQuery}`;

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [ids]);
    mysql2.queryLog(query);
    return con.query(query);
  });
};

export const remove = async (
  table: TABLE_LIST,
  id: string,
  addQuery = '',
): Promise<void> => {
  const SQL = `DELETE FROM \`${table}\` WHERE id = ? ${addQuery}`;

  const result = await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [id]);
    mysql2.queryLog(query);
    return con.query(query);
  });

  if (result.affectedRows) {
    return result;
  }

  throw new Error('No target to be deleted was found');
};

export const removeAll = async (
  table: TABLE_LIST,
  ids: string[],
  addQuery = '',
): Promise<void> => {
  const SQL = `DELETE FROM \`${table}\` WHERE id IN (?) ${addQuery}`;

  const result = await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [ids]);
    mysql2.queryLog(query);
    return con.query(query);
  });

  if (result.affectedRows) {
    return result;
  }

  throw new Error('No target to be deleted was found');
};

/*
  params description:
    - payload: req.body
    - options.keys: target columns of table
    - options.addQuery: additional query
 */
export const patch = async (
  table: TABLE_LIST,
  id: string,
  payload: { [key: string]: string | boolean },
  options: {
    keys: string[];
    addQuery?: string;
  },
): Promise<void> => {
  const keys = options.keys;
  const targets = Object.keys(payload).filter((key: string) =>
    keys.includes(key),
  );
  const queries = targets.map((key: string) => `\`${key}\` = ?`).join(',');
  const values = targets.map((key: string) => payload[key]);

  const SQL = `UPDATE \`${table}\` SET ${queries} where id = ? ${
    options.addQuery ?? ''
  }`;

  const result = await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [...values, id]);
    mysql2.queryLog(query);
    return con.query(query);
  });

  if (result.affectedRows) {
    return result;
  }

  throw new Error('No target to be updated was found');
};
