// import { getRepository, Repository } from 'typeorm';

// import IProducersRepository from '@modules/producers/repositories/IProducersRepository';
// import ICreateProducerDTO from '@modules/producers/dtos/ICreateProducerDTO';
// import Producer from '@modules/producers/infra/typeorm/entities/Producer';

// class ProducersRepository implements IProducersRepository {
//   private ormRepository: Repository<Producer>;

//   constructor() {
//     this.ormRepository = getRepository(Producer);
//   }

//   public async findAll(): Promise<Producer[]> {
//     const producers = await this.ormRepository.find();

//     return producers;
//   }

//   public async findById(id: string): Promise<Producer | undefined> {
//     const producer = await this.ormRepository.findOne({
//       where: { id },
//     });

//     return producer;
//   }

//   public async findByCpf(cpf: string): Promise<Producer | undefined> {
//     const producer = await this.ormRepository.findOne({
//       where: { cpf },
//     });

//     return producer;
//   }

//   public async create(data: ICreateProducerDTO): Promise<Producer> {
//     const producer = this.ormRepository.create(data);

//     await this.ormRepository.save(producer);

//     return producer;
//   }

//   public async save(data: Producer): Promise<Producer> {
//     return this.ormRepository.save(data);
//   }
// }

// export default ProducersRepository;
