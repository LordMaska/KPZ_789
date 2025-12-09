import { Request, Response, NextFunction } from 'express';

import { PCService } from 'services/PCService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const pcId = req.params.id;
  const service = new PCService();
  try {
    const pc = await service.delete(pcId);
    res.customSuccess(200, 'PC successfully deleted.', { pc_id: pc.pc_id });
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
