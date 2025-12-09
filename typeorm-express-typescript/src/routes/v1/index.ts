import { Router } from 'express';

import auth from './auth';
import clients from './clients';
import pcs from './pcs';
import sessions from './sessions';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/pcs', pcs);
router.use('/sessions', sessions);
router.use('/clients', clients);

export default router;
