import { Router } from 'express';

import { list, show, create, edit, destroy } from 'controllers/sessions';
import { validatorCreateSession } from 'middleware/validation/sessions/validatorCreateSession';
import { validatorEditSession } from 'middleware/validation/sessions/validatorEditSession';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', validatorCreateSession, create);
router.patch('/:id([0-9]+)', validatorEditSession, edit);
router.delete('/:id([0-9]+)', destroy);

export default router;
