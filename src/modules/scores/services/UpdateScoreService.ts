import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IScoresRepository from '../repositories/IScoresRepository';
import Score from '../infra/typeorm/entities/Score';

interface IRequest {
  id: string;
  quantity?: number;
  weight?: string;
  type?: string;
  nfe?: string;
  start_date?: Date;
  end_date?: Date;
  producer_id_sender?: string;
  farm_id_sender?: string;
  producer_id_received?: string;
  farm_id_received?: string;
  producer_id_internal?: string;
  farm_id_internal?: string;
  name?: string;
  lote?: string;
}

@injectable()
class UpdateScoreService {
  constructor(
    @inject('ScoresRepository')
    private scoresRepository: IScoresRepository,
  ) {}

  public async execute({
    id,
    quantity,
    weight,
    type,
    nfe,
    start_date,
    end_date,
    farm_id_internal,
    producer_id_internal,
    farm_id_received,
    producer_id_received,
    farm_id_sender,
    producer_id_sender,
    name,
    lote,
  }: IRequest): Promise<Score> {
    const score = await this.scoresRepository.findById(id);

    if (!score) {
      throw new AppError('Score not exists.');
    }

    if (quantity) {
      score.quantity = quantity;
    }

    if (weight) {
      score.weight = weight;
    }

    if (type) {
      score.type = type;
    }

    if (start_date) {
      score.start_date = start_date;
    }

    if (end_date) {
      score.end_date = end_date;
    }

    if (nfe) {
      score.nfe = nfe;
    }

    if (farm_id_internal) {
      score.farm_id_internal = farm_id_internal;
    }

    if (producer_id_internal) {
      score.producer_id_internal = producer_id_internal;
    }

    if (farm_id_received) {
      score.farm_id_received = farm_id_received;
    }

    if (producer_id_received) {
      score.producer_id_received = producer_id_received;
    }

    if (farm_id_sender) {
      score.farm_id_sender = farm_id_sender;
    }

    if (producer_id_sender) {
      score.producer_id_sender = producer_id_sender;
    }

    if (name) {
      score.name = name;
    }

    if (lote) {
      score.lote = lote;
    }

    return this.scoresRepository.save(score);
  }
}

export default UpdateScoreService;
