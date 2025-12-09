import { Request, Response, NextFunction } from 'express';

import { SessionResponseDTO } from 'dto/SessionResponseDTO';
import { SessionService } from 'services/SessionService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.params.id;
  const service = new SessionService();
  try {
    const session = await service.findOne(sessionId);
    res.customSuccess(200, 'Session found', new SessionResponseDTO(session));
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
