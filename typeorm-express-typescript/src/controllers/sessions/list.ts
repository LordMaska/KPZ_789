import { Request, Response, NextFunction } from 'express';

import { SessionResponseDTO } from 'dto/SessionResponseDTO';
import { SessionService } from 'services/SessionService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const service = new SessionService();
  try {
    const sessions = await service.findAll();
    const dto = sessions.map((s) => new SessionResponseDTO(s));
    res.customSuccess(200, 'List of sessions.', dto);
  } catch (err) {
    const customError =
      err instanceof CustomError ? err : new CustomError(400, 'Raw', `Can't retrieve list of sessions.`, null, err);
    return next(customError);
  }
};
