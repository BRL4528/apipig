import { Router } from 'express';

import MarkingsController from '../controllers/MarkingsController';

const markingsController = new MarkingsController();

const markingsRouter = Router();

markingsRouter.get('/', markingsController.index);

markingsRouter.post('/', markingsController.create);

markingsRouter.post('/createAll', markingsController.createAll);

// markingsRouter.post(
//   '/import',
//   upload.single('file'),
//   markingsController.import,
// );

markingsRouter.put('/', markingsController.update);

export default markingsRouter;
