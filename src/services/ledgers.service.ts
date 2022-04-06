import mysql2 from '../db';
import { PoolConnection } from 'mysql2/promise';
import {
  LedgerInterface,
  LedgerModel,
  LedgerSummaryInterface,
} from '../models/ledgers.model';

export const insertAndUpdate = async (ledger: LedgerModel): Promise<void> => {
  //Upsert Query
  const SQL =
    'INSERT INTO ledgers (`groupId`, `date`, `year`, `week`, `sales`, `visitors`, `newVisitors`, `nonBenefit`, `newSales`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) \
       ON DUPLICATE KEY UPDATE `sales` = ?, `visitors` = ?, `newVisitors` = ?, `nonBenefit` = ?, `newSales` = ?';

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [
      ledger.groupId,
      ledger.date,
      ledger.year,
      ledger.week,
      ledger.sales,
      ledger.visitors,
      ledger.newVisitors,
      ledger.nonBenefit,
      ledger.newSales,
      ledger.sales,
      ledger.visitors,
      ledger.newVisitors,
      ledger.nonBenefit,
      ledger.newSales,
    ]);
    mysql2.queryLog(query);
    return con.query(query);
  });
};

export const findByDate = async (
  groupId: number,
  date: string
): Promise<LedgerInterface[]> => {
  const SQL =
    'SELECT * FROM ledgers WHERE groupId = ? AND date = ?';

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [
      groupId,
      date
    ]);
    mysql2.queryLog(query);
    return con.query(query);
  });
};

export const getSummary = async (
  groupId: number,
  year?: string,
): Promise<LedgerSummaryInterface[]> => {
  let SQL =
    'SELECT week, SUM(sales) as sales, SUM(visitors) as visitors, SUM(newVisitors) as newVisitors, SUM(nonBenefit) as nonBenefit, SUM(newSales) as newSales FROM ledgers WHERE groupId = ?';
  if (year) {
    SQL += ' AND year = ?';
  }
  SQL += '  group by week';

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [
      groupId,
      year,
    ]);
    mysql2.queryLog(query);
    return con.query(query);
  });
};

export const getSum = async (
  groupId: number,
  year?: string,
  week?: string,
): Promise<LedgerInterface[]> => {
  let SQL =
    'SELECT SUM(sales) as sales, SUM(visitors) as visitors, SUM(newVisitors) as newVisitors, SUM(nonBenefit) as nonBenefit, SUM(newSales) as newSales FROM ledgers WHERE groupId = ?';
  if (year) {
    SQL += ' AND year = ?';
    if (week) {
      SQL += ' AND week = ?';
    }
  }

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [
      groupId,
      year,
      week,
    ]);
    mysql2.queryLog(query);
    return con.query(query);
  });
};
