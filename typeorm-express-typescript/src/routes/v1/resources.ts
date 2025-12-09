import { Router } from 'express';

import {
  list as clientsList,
  show as clientsShow,
  create as clientsCreate,
  edit as clientsEdit,
  destroy as clientsDestroy,
} from 'controllers/clients';
import {
  list as pcsList,
  show as pcsShow,
  create as pcsCreate,
  edit as pcsEdit,
  destroy as pcsDestroy,
} from 'controllers/pcs';
import {
  list as sessionsList,
  show as sessionsShow,
  create as sessionsCreate,
  edit as sessionsEdit,
  destroy as sessionsDestroy,
} from 'controllers/sessions';

const router = Router();

// PCs routes
router.get('/pcs', pcsList);
router.get('/pcs/:id([0-9]+)', pcsShow);
router.post('/pcs', pcsCreate);
router.patch('/pcs/:id([0-9]+)', pcsEdit);
router.delete('/pcs/:id([0-9]+)', pcsDestroy);

// Sessions routes
router.get('/sessions', sessionsList);
router.get('/sessions/:id([0-9]+)', sessionsShow);
router.post('/sessions', sessionsCreate);
router.patch('/sessions/:id([0-9]+)', sessionsEdit);
router.delete('/sessions/:id([0-9]+)', sessionsDestroy);

// Clients routes
router.get('/clients', clientsList);
router.get('/clients/:phone', clientsShow);
router.post('/clients', clientsCreate);
router.patch('/clients/:phone', clientsEdit);
router.delete('/clients/:phone', clientsDestroy);

export default router;
