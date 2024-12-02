import { getRepository, Repository } from 'typeorm';

import IMarkingsRepository from '@modules/markings/repositories/IMarkingsRepository';
import ICreateMarkingDTO from '@modules/markings/dtos/ICreateMarkingDTO';
import Marking from '@modules/markings/infra/typeorm/entities/Marking';

class MarkingsRepository implements IMarkingsRepository {
  private ormRepository: Repository<Marking>;

  constructor() {
    this.ormRepository = getRepository(Marking);
  }

  public async findAll(): Promise<Marking[]> {
    const markings = await this.ormRepository.find();

    return markings;
  }

  public async findAllByScoreId(score_id: string): Promise<Marking[]> {
    const markings = await this.ormRepository.find({
      where: { score_id }
    });

    return markings;
  }

  public async findById(id: string): Promise<Marking | undefined> {
    const marking = await this.ormRepository.findOne({
      where: { id },
    });

    return marking;
  }

  public async create(data: ICreateMarkingDTO): Promise<Marking> {
    const marking = this.ormRepository.create(data);

    await this.ormRepository.save(marking);

    return marking;
  }

  public async createAll(data: ICreateMarkingDTO[]): Promise<Marking[]> {
    const markings = this.ormRepository.create(data);

    await this.ormRepository.save(markings);

    return markings;
  }

  public async save(marking: Marking): Promise<Marking> {
    return this.ormRepository.save(marking);
  }
}

export default MarkingsRepository;
