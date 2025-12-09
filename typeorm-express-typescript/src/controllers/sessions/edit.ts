import { Request, Response, NextFunction } from 'express';

import { SessionService } from 'services/SessionService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.params.id;
  const { pc_id, client_phone, Time, Duration, Cost } = req.body;
  const service = new SessionService();
  try {
    await service.update(sessionId, { pc_id, client_phone, Time, Duration, Cost } as any);
    res.customSuccess(200, 'Session successfully saved.');
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
