import { Request, Response, NextFunction } from 'express';

import { ClientService } from 'services/ClientService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, full_name, birth } = req.body;
  const service = new ClientService();
  try {
    const client = await service.create({ phone, full_name, birth } as any);
    res.customSuccess(201, 'Client successfully created.', client);
  } catch (err) {
    const customError =
      err instanceof CustomError ? err : new CustomError(409, 'Raw', `Client can't be created.`, null, err);
    return next(customError);
  }
};
