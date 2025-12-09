import { Router } from 'express';

import { list, show, create, edit, destroy } from 'controllers/clients';
import { validatorCreateClient } from 'middleware/validation/clients/validatorCreateClient';
import { validatorEditClient } from 'middleware/validation/clients/validatorEditClient';

const router = Router();

router.get('/', list);
router.get('/:phone', show);
router.post('/', validatorCreateClient, create);
router.patch('/:phone', validatorEditClient, edit);
router.delete('/:phone', destroy);

export default router;
