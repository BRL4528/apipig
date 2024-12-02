import { container } from 'tsyringe';

// import './providers';

import IScoresRepository from '@modules/scores/repositories/IScoresRepository';
import ScoresRepository from '@modules/scores/infra/typeorm/repositories/ScoresRepository';

import IMarkingsRepository from '@modules/markings/repositories/IMarkingsRepository';
import MarkingsRepository from '@modules/markings/infra/typeorm/repositories/MarkingsRepository';

// import IProducersRepository from '@modules/producers/repositories/IProducersRepository';
// import ProducersRepository from '@modules/producers/infra/typeorm/repositories/ProducersRepository';

container.registerSingleton<IScoresRepository>(
  'ScoresRepository',
  ScoresRepository,
);

container.registerSingleton<IMarkingsRepository>(
  'MarkingsRepository',
  MarkingsRepository,
);

// container.registerSingleton<IProducersRepository>(
//   'ProducersRepository',
//   ProducersRepository,
// );
