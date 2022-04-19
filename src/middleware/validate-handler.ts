import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validateHandler = (validations: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(
      validations.map((validation: any) => validation.run(req)),
    );

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).send({ validateErrors: errors.array() });
  };
};

export default validateHandler;
