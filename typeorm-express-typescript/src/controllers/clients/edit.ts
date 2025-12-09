import { Request, Response, NextFunction } from 'express';

import { ClientService } from 'services/ClientService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const phone = req.params.phone;
  const { full_name, birth } = req.body;
  const service = new ClientService();
  try {
    await service.update(phone, { full_name, birth } as any);
    res.customSuccess(200, 'Client successfully saved.');
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
