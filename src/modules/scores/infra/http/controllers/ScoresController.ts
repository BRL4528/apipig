import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListScoreService from '@modules/scores/services/ListScoreService';
import ShowScoreService from '@modules/scores/services/ShowScoreService';
import CreateScoreService from '@modules/scores/services/CreateScoreService';
import UpdateScoreService from '@modules/scores/services/UpdateScoreService';
import UploadScoreService from '@modules/scores/services/UploadScoreService';
import DeleteScoreService from '@modules/scores/services/DeleteScoreService';
import UploadAllScoreService from '@modules/scores/services/UploadAllScoreService';

export default class ScoresController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listScore = container.resolve(ListScoreService);

    const score = await listScore.execute();

    return res.json(score);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.query;

    const showScore = container.resolve(ShowScoreService);

    const score = await showScore.execute(String(id));

    return res.json(score);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const {
      quantity,
      weight,
      start_date,
      end_date,
      type,
      nfe,
      name,
      lote,
      farm_id_internal,
      producer_id_internal,
      farm_id_received,
      producer_id_received,
      farm_id_sender,
      producer_id_sender,
    } = req.body;

    const createScore = container.resolve(CreateScoreService);

    const score = await createScore.execute({
      quantity,
      weight,
      type,
      nfe,
      name,
      lote,
      start_date,
      end_date,
      farm_id_internal,
      producer_id_internal,
      farm_id_received,
      producer_id_received,
      farm_id_sender,
      producer_id_sender,
    });

    return res.json(score);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.query;
    const {
      quantity,
      weight,
      start_date,
      end_date,
      type,
      nfe,
      name,
      lote,
      farm_id_internal,
      producer_id_internal,
      farm_id_received,
      producer_id_received,
      farm_id_sender,
      producer_id_sender,
    } = req.body;

    const updateScore = container.resolve(UpdateScoreService);

    const score = await updateScore.execute({
      id: String(id),
      quantity,
      weight,
      type,
      nfe,
      name,
      lote,
      start_date,
      end_date,
      farm_id_internal,
      producer_id_internal,
      farm_id_received,
      producer_id_received,
      farm_id_sender,
      producer_id_sender,
    });

    return res.json(score);
  }

  public async uploadFile(req: Request, res: Response): Promise<Response> {
    const { id } = req.query;

    const uploadScore = container.resolve(UploadScoreService);

    const score = await uploadScore.execute({
      id: String(id),
    });

    return res.json(score);
  }

  public async uploadAll(req: Request, res: Response): Promise<Response> {
    const uploadScore = container.resolve(UploadAllScoreService);

    const score = await uploadScore.execute();

    return res.json(score);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.query;

    const deleteScore = container.resolve(DeleteScoreService);

    const score = await deleteScore.execute(String(id));

    return res.json(score);
  }
}
