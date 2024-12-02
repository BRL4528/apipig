import { Router } from 'express';

import scoresRouter from '@modules/scores/infra/http/routes/scores.routes';
import markingsRouter from '@modules/markings/infra/http/routes/markings.routes';
// import producersRouter from '@modules/producers/infra/http/routes/producers.routes';

const routes = Router();

routes.use('/scores', scoresRouter);
routes.use('/markings', markingsRouter);
// routes.use('/producers', producersRouter);

export default routes;
