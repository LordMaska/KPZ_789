import { Request, Response, NextFunction } from 'express';

import { SessionService } from 'services/SessionService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.params.id;
  const service = new SessionService();
  try {
    const session = await service.delete(sessionId);
    res.customSuccess(200, 'Session successfully deleted.', { session_id: session.session_id });
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
