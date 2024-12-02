import { injectable, inject } from 'tsyringe';

import IMarkingsRepository from '../repositories/IMarkingsRepository';
import Marking from '../infra/typeorm/entities/Marking';
import ICreateMarkingDTO from '../dtos/ICreateMarkingDTO';

@injectable()
class CreateAllMarkingService {
  constructor(
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,
  ) {}

  public async execute(data: ICreateMarkingDTO[]): Promise<Marking[]> {
    const markings = await this.markingsRepository.createAll(data);

    return markings;
  }
}

export default CreateAllMarkingService;
