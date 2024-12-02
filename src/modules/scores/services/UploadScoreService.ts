import { injectable, inject } from 'tsyringe';
import fetch from 'node-fetch';

import AppError from '@shared/errors/AppError';
import IScoresRepository from '../repositories/IScoresRepository';

interface IRequest {
  id: string;
}

@injectable()
class UploadScoreService {
  constructor(
    @inject('ScoresRepository')
    private scoresRepository: IScoresRepository,
  ) { }

  public async execute({ id }: IRequest): Promise<any> {
    const score = await this.scoresRepository.findById(id);

    if (!score) {
      throw new AppError('Score does not exists.');
    }

    if (score.status === true) {
      throw new AppError('Score status true');
    }

    // if (Number(score.quantity) < 1) {
    //   score.status = true;
    //   await this.scoresRepository.save(score);

    //   throw new AppError('Score quantity zero');
    // }

    const { _, token } = await fetch('http://167.71.20.221/sessions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cpf: '777' }),
    }).then(async (response) => {
      if (response.status === 200) {
        return response.json();
      }

      const text = await response.text()
      const { _, message } = JSON.parse(text);

      throw new AppError(message, response.status);
    }).catch(async (err) => {
      throw new AppError(err.message);
    });

    // score.file = file;
    score.status = true;

    const scoreWithRelation = await this.scoresRepository.save(score);

    const scoreReturn = await fetch(`http://167.71.20.221/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(scoreWithRelation),
    }).catch(async (err) => {
      score.status = false;
      await this.scoresRepository.save(score);

      throw new AppError('Fetch erro in upload.');
    });

    return scoreReturn;
  }
}

export default UploadScoreService;
