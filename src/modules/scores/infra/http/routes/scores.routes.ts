import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ScoresController from '../controllers/ScoresController';

const scoresController = new ScoresController();

const scoresRouter = Router();
const upload = multer(uploadConfig);

scoresRouter.get('/', scoresController.index);
scoresRouter.get('/show', scoresController.show);
scoresRouter.post('/', scoresController.create);
scoresRouter.post('/uploadAll', scoresController.uploadAll);
scoresRouter.put('/', scoresController.update);
scoresRouter.patch('/upload', scoresController.uploadFile);
scoresRouter.delete('/', scoresController.delete);

export default scoresRouter;
