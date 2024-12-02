import Score from '../infra/typeorm/entities/Score';
import ICreateScoreDTO from '../dtos/ICreateScoreDTO';
import { DeleteResult } from 'typeorm';

export default interface IScoresRepository {
  findAll(): Promise<Score[]>;
  findAllStatus(status: boolean): Promise<Score[]>;
  findById(id: string): Promise<Score | undefined>;
  findByStatus(status: boolean): Promise<Score[]>;
  create(data: ICreateScoreDTO): Promise<Score>;
  save(score: Score): Promise<Score>;
  delete(id: string): Promise<DeleteResult>;
}
