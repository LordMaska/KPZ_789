import { Request, Response, NextFunction } from 'express';

import { PCService } from 'services/PCService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const pcId = req.params.id;
  const { cpu, ram, videocard, hard_disc, usb_amout, os, buy_date } = req.body;
  const service = new PCService();
  try {
    await service.update(pcId, { cpu, ram, videocard, hard_disc, usb_amout, os, buy_date } as any);
    res.customSuccess(200, 'PC successfully saved.');
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
