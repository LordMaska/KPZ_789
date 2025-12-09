import { Request, Response, NextFunction } from 'express';

import { PCResponseDTO } from 'dto/PCResponseDTO';
import { PCService } from 'services/PCService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { cpu, ram, videocard, hard_disc, usb_amout, os, buy_date } = req.body;
  const service = new PCService();
  try {
    const pc = await service.create({ cpu, ram, videocard, hard_disc, usb_amout, os, buy_date } as any);
    res.customSuccess(201, 'PC successfully created.', new PCResponseDTO(pc));
  } catch (err) {
    const customError =
      err instanceof CustomError ? err : new CustomError(409, 'Raw', `PC can't be created.`, null, err);
    return next(customError);
  }
};
