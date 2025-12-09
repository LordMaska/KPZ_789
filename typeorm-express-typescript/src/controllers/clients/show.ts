import { Request, Response, NextFunction } from 'express';

import { ClientResponseDTO } from 'dto/ClientResponseDTO';
import { ClientService } from 'services/ClientService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const phone = req.params.phone;
  const service = new ClientService();
  try {
    const client = await service.findOne(phone);
    res.customSuccess(200, 'Client found', new ClientResponseDTO(client));
  } catch (err) {
    const customError = err instanceof CustomError ? err : new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
