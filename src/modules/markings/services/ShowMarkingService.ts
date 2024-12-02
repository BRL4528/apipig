import { injectable, inject } from 'tsyringe';

import IMarkingsRepository from '../repositories/IMarkingsRepository';
import Marking from '../infra/typeorm/entities/Marking';

@injectable()
class ShowMarkingService {
  constructor(
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,
  ) {}

  public async execute(score_id: string): Promise<Marking[]> {
    const markings = await this.markingsRepository.findAllByScoreId(score_id);

    return markings;
  }
}

export default ShowMarkingService;
