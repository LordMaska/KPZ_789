import { Request, Response, NextFunction } from 'express';

import { PCResponseDTO } from 'dto/PCResponseDTO';
import { PCService } from 'services/PCService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const pcId = req.params.id;
  const service = new PCService();
  try {
    const pc = await service.findOne(pcId);
    res.customSuccess(200, 'PC found', new PCResponseDTO(pc));
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
