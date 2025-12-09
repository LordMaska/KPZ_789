import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEditPc = async (req: Request, res: Response, next: NextFunction) => {
  const { cpu, ram, videocard, hard_disc, usb_amout, os, buy_date } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (cpu !== undefined && validator.isEmpty(String(cpu))) {
    errorsValidation.push({ cpu: 'CPU cannot be empty' });
  }

  if (ram !== undefined) {
    const ramStr = String(ram);
    if (!validator.isInt(ramStr)) {
      errorsValidation.push({ ram: 'RAM must be an integer' });
    }
  }

  if (videocard !== undefined && validator.isEmpty(String(videocard))) {
    errorsValidation.push({ videocard: 'Videocard cannot be empty' });
  }

  if (hard_disc !== undefined && validator.isEmpty(String(hard_disc))) {
    errorsValidation.push({ hard_disc: 'Hard disc cannot be empty' });
  }

  if (usb_amout !== undefined) {
    const usbStr = String(usb_amout);
    if (!validator.isInt(usbStr)) {
      errorsValidation.push({ usb_amout: 'USB amount must be an integer' });
    }
  }

  if (os !== undefined && validator.isEmpty(String(os))) {
    errorsValidation.push({ os: 'OS cannot be empty' });
  }

  if (buy_date !== undefined) {
    if (!validator.isISO8601(String(buy_date))) {
      errorsValidation.push({ buy_date: 'Buy date must be a valid date (ISO 8601)' });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit PC validation error', null, null, errorsValidation);
    return next(customError);
  }

  return next();
};
