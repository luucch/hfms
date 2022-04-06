import HttpException from '../classes/http-exception';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const status = error.statusCode || 500;
  const message = error.message || '알 수 없는 에러가 발생했습니다.';

  response.status(status).send({ message });
};
