import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMarkingsRepository from '../repositories/IMarkingsRepository';
import Marking from '../infra/typeorm/entities/Marking';

interface IRequest {
  id: string;
  quantity?: number;
  weight?: string;
  score_id?: string;
  sequence?: number;
}

@injectable()
class UpdateMarkingService {
  constructor(
    @inject('MarkingsRepository')
    private markingsRepository: IMarkingsRepository,
  ) {}

  public async execute({
    id,
    quantity,
    weight,
    score_id,
    sequence,
  }: IRequest): Promise<Marking> {
    const marking = await this.markingsRepository.findById(id);

    if (!marking) {
      throw new AppError('Marking not exists.');
    }

    if (quantity) {
      marking.quantity = quantity;
    }

    if (weight) {
      marking.weight = weight;
    }

    if (score_id) {
      marking.score_id = score_id;
    }

    if (sequence) {
      marking.sequence = sequence;
    }

    return this.markingsRepository.save(marking);
  }
}

export default UpdateMarkingService;
