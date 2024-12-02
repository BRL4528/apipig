import fs from 'fs';
import { resolve } from 'path';

import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async save(file: string, folder: string): Promise<string> {
    await fs.promises.rename(
      resolve(uploadConfig.tmpFolder, file),
      resolve(`${uploadConfig.tmpFolder}/${folder}`, file),
    );

    return file;
  }

  public async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${uploadConfig.tmpFolder}/${folder}`, file);

    try {
      await fs.promises.stat(filename);
    } catch {
      return;
    }

    await fs.promises.unlink(filename);
  }
}

export default DiskStorageProvider;
