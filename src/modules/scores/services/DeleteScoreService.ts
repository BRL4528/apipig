import { injectable, inject } from 'tsyringe';

import IScoresRepository from '../repositories/IScoresRepository';
import AppError from '@shared/errors/AppError';

@injectable()
class DeleteScoreService {
  constructor(
    @inject('ScoresRepository')
    private scoresRepository: IScoresRepository,
  ) {}

  public async execute(id: string): Promise<any> {
    const score = await this.scoresRepository.findById(id);

    if (!score) {
      throw new AppError('Score does not exists.')
    }

    await this.scoresRepository.delete(id);

    return { message: 'Score deleted.'}
  }
}

export default DeleteScoreService;
