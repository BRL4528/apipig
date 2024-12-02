import { classToClass } from 'class-transformer';

import IScoreResponseDTO from '../dtos/IScoreResponseDTO';
import Score from '../infra/typeorm/entities/Score';

// eslint-disable-next-line import/prefer-default-export
export class ScoreMap {
  static toDTO({
    id,
    weight,
    type,
    nfe,
    quantity,
    start_date,
    end_date,
    status,
    file,
    file_url,
    markings,
    created_at,
    updated_at,
    farm_id_internal,
    producer_id_internal,
    farm_id_received,
    producer_id_received,
    farm_id_sender,
    producer_id_sender,
  }: Score): IScoreResponseDTO {
    const score = classToClass({
      id,
      weight,
      type,
      nfe,
      quantity,
      start_date,
      end_date,
      status,
      file,
      file_url,
      markings,
      created_at,
      updated_at,
      farm_id_internal,
      producer_id_internal,
      farm_id_received,
      producer_id_received,
      farm_id_sender,
      producer_id_sender,
    });

    return score;
  }
}
