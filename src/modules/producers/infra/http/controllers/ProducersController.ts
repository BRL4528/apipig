// import { Request, Response } from 'express';
// import { container } from 'tsyringe';

// import ListProducerService from '@modules/producers/services/ListProducerService';
// // import ShowAccessService from '@modules/producers/services/ShowAccessService';
// import CreateProducerService from '@modules/producers/services/CreateProducerService';

// export default class ProducersController {
//   public async index(req: Request, res: Response): Promise<Response> {
//     const listProducers = container.resolve(ListProducerService);

//     const producers = await listProducers.execute();

//     return res.json(producers);
//   }

//   // public async show(req: Request, res: Response): Promise<Response> {
//   //   const { access_id, sector_id } = req.query;

//   //   const showAccess = container.resolve(ShowAccessService);

//   //   const producer = await showAccess.execute({
//   //     access_id: access_id ? String(access_id) : undefined,
//   //     sector_id: sector_id ? String(sector_id) : undefined,
//   //   });

//   //   return res.json(producer);
//   // }

//   public async create(req: Request, res: Response): Promise<Response> {
//     const {
//       name,
//       cpf,
//       internal_code,
//     } = req.body;

//     const createProducer = container.resolve(CreateProducerService);

//     const producer = await createProducer.execute({
//       name,
//       cpf,
//       internal_code,
//     });

//     return res.json(producer);
//   }
// }
