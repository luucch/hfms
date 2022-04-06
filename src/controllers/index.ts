import { Router } from 'express';
import ledgersRouter from './ledgers.controller';
import usersRouter from './users.controller';

const route = Router();

route.use('/users', usersRouter);
route.use('/ledgers', ledgersRouter);

export default route;
