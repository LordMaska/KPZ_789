import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreateSession = async (req: Request, res: Response, next: NextFunction) => {
  let { pc_id, client_phone, Time, Duration, Cost } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  pc_id = pc_id === undefined || pc_id === null ? '' : String(pc_id);
  client_phone = !client_phone ? '' : client_phone;
  Time = !Time ? '' : Time;
  Duration = !Duration ? '' : Duration;
  Cost = Cost === undefined || Cost === null ? '' : String(Cost);

  if (validator.isEmpty(pc_id) || !validator.isInt(pc_id)) {
    errorsValidation.push({ pc_id: 'pc_id is required and must be an integer' });
  }

  if (validator.isEmpty(client_phone)) {
    errorsValidation.push({ client_phone: 'Client phone is required' });
  } else if (!validator.isLength(client_phone, { min: 1, max: 15 })) {
    errorsValidation.push({ client_phone: 'Client phone must be at most 15 characters' });
  }

  if (validator.isEmpty(Time) || !validator.isISO8601(Time)) {
    errorsValidation.push({ Time: 'Time is required and must be a valid ISO 8601 datetime' });
  }

  if (validator.isEmpty(Duration)) {
    errorsValidation.push({ Duration: 'Duration is required' });
  }

  if (validator.isEmpty(Cost) || !validator.isFloat(Cost)) {
    errorsValidation.push({ Cost: 'Cost is required and must be a number' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create Session validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
