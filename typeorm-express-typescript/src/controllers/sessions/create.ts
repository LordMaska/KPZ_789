import { Request, Response, NextFunction } from 'express';

import { SessionResponseDTO } from 'dto/SessionResponseDTO';
import { SessionService } from 'services/SessionService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { pc_id, client_phone, Time, Duration, Cost } = req.body;
  const service = new SessionService();
  try {
    const session = await service.create({ pc_id, client_phone, Time, Duration, Cost } as any);
    res.customSuccess(201, 'Session successfully created.', new SessionResponseDTO(session as any));
  } catch (err) {
    const customError =
      err instanceof CustomError ? err : new CustomError(409, 'Raw', `Session can't be created.`, null, err);
    return next(customError);
  }
};
