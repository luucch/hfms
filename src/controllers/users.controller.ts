import { Request, Response, Router } from 'express';
import validateHandler from '../middleware/validate-handler';
import { body, header, query } from 'express-validator';
import * as UserService from '../services/users.service';
import authHandler from '../middleware/auth-handler';
import { UserInterface } from '../models/users.model';

const usersRouter = Router();
usersRouter.post(
  '/login',
  body('id').exists(),
  body('password').isLength({ min: 5 }),
  async (req: Request, res: Response) => {
    try {
      const token = await UserService.login(req.body.id, req.body.password);
      if(token == null) {
        res.status(401).send('login failed');
      }
      res.status(200).send(token);
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
);

usersRouter.get(
  '/me',
  authHandler,
  async (req: Request, res: Response) => {
    console.log(res.locals);
    try {
      const user = await UserService.findByUserId(res.locals.userId) as UserInterface;
      const userRes = {
        id: user.id,
        groupId: user.groupId,
        name: user.name,
        email: user.email,
      }
      res.status(200).send(userRes);
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
);

export default usersRouter;
