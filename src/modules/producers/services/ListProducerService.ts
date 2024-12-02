// /* eslint-disable no-nested-ternary */
// import { injectable, inject } from 'tsyringe';

// import IProducersRepository from '../repositories/IProducersRepository';
// import Producer from '../infra/typeorm/entities/Producer';

// @injectable()
// class ListProducerService {
//   constructor(
//     @inject('ProducersRepository')
//     private producersRepository: IProducersRepository,
//   ) {}

//   public async execute(): Promise<Producer[]> {
//     return this.producersRepository.findAll();
//   }
// }

// export default ListProducerService;
