import { query, Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import * as LedgerService from '../services/ledgers.service';
import * as CommonService from '../services/common.service';
import { LedgerInterface, LedgerModel } from '../models/ledgers.model';
import validateHandler from '../middleware/validate-handler';
import { TABLE_LIST } from '../models/tables.model';
import authHandler from '../middleware/auth-handler';

const ledgersRouter = Router();

ledgersRouter.post(
  '/',
  validateHandler([
    body('date').exists().withMessage('date is required'),
  ]),
  authHandler,
  async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      const date = new Date(req.body.date);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);

      const oneJan = new Date(date.getFullYear(),0,1);
      const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));

      const newLedger = new LedgerModel();
      newLedger.date = Number(year + month + day);
      newLedger.year = year;
      newLedger.week = Math.ceil(( date.getDay() + 1 + numberOfDays) / 7);
      newLedger.sales = req.body.sales;
      newLedger.visitors = req.body.visitors;
      newLedger.newVisitors = req.body.newVisitors;
      newLedger.nonBenefit = req.body.nonBenefit;
      newLedger.newSales = req.body.newSales;
      newLedger.groupId = res.locals.groupId;
      console.log(newLedger);
      await LedgerService.insertAndUpdate(newLedger);

      res.status(200).send(newLedger);
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
);

ledgersRouter.get(
  '/',
  authHandler,
  async (req: Request, res: Response) => {
  try {
    const year = req.query.year?.toString();
    const week = req.query.week?.toString();
    console.log(year, week);
    let result = await LedgerService.getSum(res.locals.groupId, year, week);
    res.status(200).send(result[0]);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

ledgersRouter.get(
  '/summary',
  authHandler,
  async (req: Request, res: Response) => {
  try {
    const result: any = [];
    const year = req.query.year?.toString();
    let summary = await LedgerService.getSummary(res.locals.groupId, year);
    summary.forEach(data => {
      console.log(data);
      const resp = {
        week: data.week,
        sales: data.sales *1,
        visitors: data.visitors *1,
        salesPerUser: data.sales / data.visitors,
        nonBenefitRate: data.nonBenefit / data.sales,
        revisitRate: (data.visitors - data.newVisitors) / data.visitors,
        newSalesPerUser: data.newSales / data.newVisitors,
        revisitSalesPerUser: (data.sales - data.newSales) / (data.visitors - data.newVisitors),
      }
      result.push(resp);
    });
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


ledgersRouter.get(
  '/:date',
  authHandler,
  async (req: Request, res: Response) => {
  try {
    const dateString = req.params.date.replace(/-/g, '');
    let result = await LedgerService.findByDate(res.locals.groupId, dateString);
    console.log(dateString, result[0]);
    res.status(200).send(result[0]);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

export default ledgersRouter;
