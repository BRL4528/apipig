import { injectable, inject } from 'tsyringe';
import fetch from 'node-fetch';

import AppError from '@shared/errors/AppError';
import IScoresRepository from '../repositories/IScoresRepository';

@injectable()
class UploadAllScoreService {
  constructor(
    @inject('ScoresRepository')
    private scoresRepository: IScoresRepository,
  ) { }

  public async execute(): Promise<any> {
    const scores = await this.scoresRepository.findAllStatus(false);

    if (scores.length < 1) {
      throw new AppError('There is no false status score.')
    }

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

    const scoresUpload = await Promise.all(
      scores.map(async score => {
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
      })
    );

    return scoresUpload;
  }
}

export default UploadAllScoreService;
