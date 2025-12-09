import { Router } from 'express';

import { list, show, create, edit, destroy } from 'controllers/pcs';
import { validatorCreatePc } from 'middleware/validation/pcs/validatorCreatePc';
import { validatorEditPc } from 'middleware/validation/pcs/validatorEditPc';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', validatorCreatePc, create);
router.patch('/:id([0-9]+)', validatorEditPc, edit);
router.delete('/:id([0-9]+)', destroy);

export default router;
