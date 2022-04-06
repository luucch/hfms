
export interface LedgerInterface {
  date: number;
  year: number;
  week: number;
  sales: number;
  visitors: number;
  newVisitors: number;
  nonBenefit: number;
  groupId: number;
  newSales: number;
}

export interface LedgerSummaryInterface {
  week: number,
  sales: number,
  newVisitors: number;
  nonBenefit: number;
  visitors: number,
  newSales: number;
}

export class LedgerModel implements LedgerInterface {
  date = 0;
  year = 0;
  week = 0;
  sales = 0;
  visitors = 0;
  newVisitors = 0;
  nonBenefit = 0;
  groupId = 0;
  newSales = 0;

  constructor(properties?: LedgerInterface) {
    properties && Object.assign(this, properties);
  }
}
