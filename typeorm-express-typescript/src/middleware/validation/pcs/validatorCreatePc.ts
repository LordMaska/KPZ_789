import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreatePc = async (req: Request, res: Response, next: NextFunction) => {
  let { cpu, ram, videocard, hard_disc, usb_amout, os, buy_date } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  cpu = !cpu ? '' : cpu;
  ram = ram === undefined || ram === null ? '' : String(ram);
  videocard = !videocard ? '' : videocard;
  hard_disc = !hard_disc ? '' : hard_disc;
  usb_amout = usb_amout === undefined || usb_amout === null ? '' : String(usb_amout);
  os = !os ? '' : os;
  buy_date = !buy_date ? '' : buy_date;

  if (validator.isEmpty(cpu)) {
    errorsValidation.push({ cpu: 'CPU is required' });
  }

  if (validator.isEmpty(ram)) {
    errorsValidation.push({ ram: 'RAM is required' });
  } else if (!validator.isInt(ram)) {
    errorsValidation.push({ ram: 'RAM must be an integer' });
  }

  if (validator.isEmpty(videocard)) {
    errorsValidation.push({ videocard: 'Videocard is required' });
  }

  if (validator.isEmpty(hard_disc)) {
    errorsValidation.push({ hard_disc: 'Hard disc is required' });
  }

  if (validator.isEmpty(usb_amout)) {
    errorsValidation.push({ usb_amout: 'USB amount is required' });
  } else if (!validator.isInt(usb_amout)) {
    errorsValidation.push({ usb_amout: 'USB amount must be an integer' });
  }

  if (validator.isEmpty(os)) {
    errorsValidation.push({ os: 'OS is required' });
  }

  if (validator.isEmpty(buy_date)) {
    errorsValidation.push({ buy_date: 'Buy date is required' });
  } else if (!validator.isISO8601(buy_date)) {
    errorsValidation.push({ buy_date: 'Buy date must be a valid date (ISO 8601)' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Create PC validation error', null, null, errorsValidation);
    return next(customError);
  }

  return next();
};
