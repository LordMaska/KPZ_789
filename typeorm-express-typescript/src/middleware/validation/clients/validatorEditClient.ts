import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEditClient = async (req: Request, res: Response, next: NextFunction) => {
  const { full_name, birth } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (full_name !== undefined && validator.isEmpty(String(full_name))) {
    errorsValidation.push({ full_name: 'Full name cannot be empty' });
  }

  if (birth !== undefined && !validator.isISO8601(String(birth))) {
    errorsValidation.push({ birth: 'Birth must be a valid date (ISO 8601)' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Edit Client validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
