import { injectable, inject } from 'tsyringe';

import IScoresRepository from '../repositories/IScoresRepository';
import Score from '../infra/typeorm/entities/Score';

interface IRequest {
  quantity: number;
  weight: string;
  type: string;
  nfe: string;
  start_date: Date;
  end_date: Date;
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
class CreateScoreService {
  constructor(
    @inject('ScoresRepository')
    private scoresRepository: IScoresRepository,
  ) {}

  public async execute({
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
    const score = await this.scoresRepository.create({
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
    });

    return score;
  }
}

export default CreateScoreService;
