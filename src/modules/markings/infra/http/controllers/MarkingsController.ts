import e, { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListMarkingService from '@modules/markings/services/ListMarkingService';
// import ShowWarningService from '@modules/markings/services/ShowWarningService';
import CreateMarkingService from '@modules/markings/services/CreateMarkingService';
import CreateAllMarkingService from '@modules/markings/services/CreateAllMarkingService';
import UpdateMarkingService from '@modules/markings/services/UpdateMarkingService';
// import ImportWarningService from '@modules/markings/services/ImportWarningService';

export default class MarkingsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listMarking = container.resolve(ListMarkingService);

    const markings = await listMarking.execute();

    return res.json(markings);
  }

  // public async show(req: Request, res: Response): Promise<Response> {
  //   const { quantity } = req.params;

  //   const showWarning = container.resolve(ShowWarningService);

  //   const employee = await showWarning.execute({
  //     quantity: Number(quantity),
  //   });

  //   return res.json(employee);
  // }

  // public async import(req: Request, res: Response): Promise<Response> {
  //   const importWarning = container.resolve(ImportWarningService);

  //   const warnings = await importWarning.execute(req.file.path);

  //   return res.json(warnings);
  // }

  public async create(req: Request, res: Response): Promise<Response> {
    const { quantity, weight, score_id, sequence } = req.body;

    const createMarking = container.resolve(CreateMarkingService);

    const marking = await createMarking.execute({
      quantity,
      weight,
      score_id,
      sequence,
    });

    return res.json(marking);
  }

  public async createAll(req: Request, res: Response): Promise<Response> {
    const createAllMarking = container.resolve(CreateAllMarkingService);

    const markings = await createAllMarking.execute(req.body);

    return res.json(markings);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.query;
    const { quantity, weight, score_id, sequence } = req.body;

    const updateMarking = container.resolve(UpdateMarkingService);

    const marking = await updateMarking.execute({
      id: String(id),
      quantity,
      weight,
      score_id,
      sequence,
    });

    return res.json(marking);
  }
}
