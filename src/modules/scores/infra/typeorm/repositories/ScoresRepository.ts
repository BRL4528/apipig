import { DeleteResult, getRepository, Repository } from 'typeorm';

import IScoresRepository from '@modules/scores/repositories/IScoresRepository';
import ICreateScoreDTO from '@modules/scores/dtos/ICreateScoreDTO';
import Score from '@modules/scores/infra/typeorm/entities/Score';

class ScoresRepository implements IScoresRepository {
  private ormRepository: Repository<Score>;

  constructor() {
    this.ormRepository = getRepository(Score);
  }

  public async findAll(): Promise<Score[]> {
    const scores = await this.ormRepository.find();

    return scores;
  }

  public async findAllStatus(status: boolean): Promise<Score[]> {
    const scores = await this.ormRepository.find({
      where: { status },
    });

    return scores;
  }

  public async findById(id: string): Promise<Score | undefined> {
    const score = await this.ormRepository.findOne({
      where: { id },
    });

    return score;
  }

  public async findByStatus(status: boolean): Promise<Score[]> {
    const scores = await this.ormRepository.find({
      where: { status },
    });

    return scores;
  }

  public async create(data: ICreateScoreDTO): Promise<Score> {
    const score = this.ormRepository.create(data);

    await this.ormRepository.save(score);

    return score;
  }

  public async save(score: Score): Promise<Score> {
    return this.ormRepository.save(score);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return this.ormRepository.delete({ id });
  }
}

export default ScoresRepository;
