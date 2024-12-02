import { injectable, inject } from 'tsyringe';

import IMarkingsRepository from '../repositories/IMarkingsRepository';
import Marking from '../infra/typeorm/entities/Marking';

@injectable()
class ListMarkingService {
  constructor(
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,
  ) {}

  public async execute(): Promise<Marking[]> {
    const markings = await this.markingsRepository.findAll();

    return markings;
  }
}

export default ListMarkingService;
