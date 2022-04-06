import { NextFunction, Request, Response } from 'express';
import conf from '../config/jwt';
import { UserInterface } from '../models/users.model';
import jwt, { decode } from 'jsonwebtoken';

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers['x-user-auth-token'] as string;
  if (!token) {
    res.status(401).send();
    return;
  } else {
    try {
      const decoded = jwt.verify(token, conf.secretKey!) as UserInterface ;
      res.locals.userId = decoded.id;
      res.locals.groupId = decoded.groupId;
    } catch (err) {
      res.status(401).send(err.message);
      return;
    }
    
    return next();
  }
}
export default authHandler;
