import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreateClient = async (req: Request, res: Response, next: NextFunction) => {
  let { phone, full_name, birth } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  phone = !phone ? '' : phone;
  full_name = !full_name ? '' : full_name;
  birth = !birth ? '' : birth;

  if (validator.isEmpty(phone)) {
    errorsValidation.push({ phone: 'Phone is required' });
  } else if (!validator.isLength(phone, { min: 1, max: 15 })) {
    errorsValidation.push({ phone: 'Phone must be at most 15 characters' });
  }

  if (validator.isEmpty(full_name)) {
    errorsValidation.push({ full_name: 'Full name is required' });
  }

  if (validator.isEmpty(birth)) {
    errorsValidation.push({ birth: 'Birth date is required' });
  } else if (!validator.isISO8601(birth)) {
    errorsValidation.push({ birth: 'Birth must be a valid date (ISO 8601)' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create Client validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
