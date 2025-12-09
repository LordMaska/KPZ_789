import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEditSession = async (req: Request, res: Response, next: NextFunction) => {
  const { pc_id, client_phone, Time, Duration, Cost } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (pc_id !== undefined && !validator.isInt(String(pc_id))) {
    errorsValidation.push({ pc_id: 'pc_id must be an integer' });
  }

  if (client_phone !== undefined && !validator.isLength(String(client_phone), { min: 1, max: 15 })) {
    errorsValidation.push({ client_phone: 'Client phone must be at most 15 characters' });
  }

  if (Time !== undefined && !validator.isISO8601(String(Time))) {
    errorsValidation.push({ Time: 'Time must be a valid ISO 8601 datetime' });
  }

  if (Cost !== undefined && !validator.isFloat(String(Cost))) {
    errorsValidation.push({ Cost: 'Cost must be a number' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Edit Session validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
