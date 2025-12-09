import { Request, Response, NextFunction } from 'express';

import { PCResponseDTO } from 'dto/PCResponseDTO';
import { PCService } from 'services/PCService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const service = new PCService();
  try {
    const pcs = await service.findAll();
    const dto = pcs.map((p) => new PCResponseDTO(p));
    res.customSuccess(200, 'List of PCs.', dto);
  } catch (err) {
    const customError =
      err instanceof CustomError ? err : new CustomError(400, 'Raw', `Can't retrieve list of PCs.`, null, err);
    return next(customError);
  }
};
