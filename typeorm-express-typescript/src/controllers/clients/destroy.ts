import { Request, Response, NextFunction } from 'express';

import { ClientService } from 'services/ClientService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const phone = req.params.phone;
  const service = new ClientService();
  try {
    const client = await service.delete(phone);
    res.customSuccess(200, 'Client successfully deleted.', { phone: client.phone });
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
