import { injectable, inject } from 'tsyringe';
import { differenceInMinutes, minutesToHours } from 'date-fns';

import IScoresRepository from '../repositories/IScoresRepository';
import AppError from '@shared/errors/AppError';

@injectable()
class ShowScoreService {
  constructor(
    @inject('ScoresRepository')
    private scoresRepository: IScoresRepository,
  ) {}

  public async execute(id: string): Promise<any> {
    const score = await this.scoresRepository.findById(id);

    if (!score) {
      throw new AppError('Score does not exists.')
    }

    const duration = differenceInMinutes(score.end_date, score.start_date);

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return {...score, duration: { hours,minutes } };
  }
}

export default ShowScoreService;
