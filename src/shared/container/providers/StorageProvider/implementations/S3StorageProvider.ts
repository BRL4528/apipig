import fs from 'fs';
import mime from 'mime';
import mimeTypes from 'mime-types';
import { resolve } from 'path';
import { S3 } from 'aws-sdk';
import _ from 'underscore';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  public async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(uploadConfig.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalName);
    // const fileContent = await fs.promises.readFile(originalName, {
    //   encoding: 'utf-8',
    // });

    const ContentType = mime.getType(originalName);

    const [, type] = originalName.split('@');

    if (type === 'blob') {
      await this.client
        .putObject({
          Bucket: `${process.env.AWS_BUCKET}/${folder}`,
          Key: file,
          ACL: 'public-read',
          Body: fileContent,
          ContentType: 'application/octet-stream',
        })
        .promise();

      await fs.promises.unlink(originalName);

      return file;
    }

    if (!ContentType) {
      throw new AppError('Error Content Type!');
    }

    await this.client
      .putObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalName);

    return file;
  }

  public async delete(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }

  public async saveMultiPart(file: string, folder: string): Promise<any> {
    const filePath = resolve(uploadConfig.tmpFolder, file);

    const fileBuffer = await fs.promises.readFile(filePath);
    // const fileContent = await fs.promises.readFile(filePath, {
    //   encoding: 'utf-8',
    // });

    const ContentType = mimeTypes.lookup(filePath);

    if (ContentType === false) {
      throw new AppError('Mime types lookup error')
    }

    let multipartCreateResult = await this.client.createMultipartUpload({
      Bucket: `${process.env.AWS_BUCKET}/${folder}`,
      Key: file,
      ContentType,
      ACL: 'public-read',
      StorageClass: 'STANDARD'
    }).promise();

    console.log("S3Helper: multipartUploadFile createResult - ", multipartCreateResult)


    let chunkCount = 1;
    let CHUNK_SIZE = 10 * 1024 * 1024;

    let uploadedParts: any[] = []

    const UploadId = multipartCreateResult.UploadId;

    if (!UploadId) {
      throw new AppError('UploadId does not exist.')
    }

    const gatherChunks = async () => {
      const stream = fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE });
      for await(const data of stream) {
          // do something with data
          let etag = await this.client.uploadPart({
              Body: data,
              Bucket: `${process.env.AWS_BUCKET}/${folder}`,
              Key: file,
              PartNumber: chunkCount,
              UploadId,
          }).promise()
          .then( (result) => {
            if (result.ETag) {
              return result.ETag.toString()
            }
          })

          uploadedParts.push({
              ETag: etag,
              PartNumber: chunkCount
          })
          chunkCount++;
      }
    }

    gatherChunks().then( () => {
      let sortedUploads = _.sortBy(uploadedParts, 'PartNumber')
      console.log("Sorted uploadedParts: ", sortedUploads)
      return this.client.completeMultipartUpload({
          Bucket: `${process.env.AWS_BUCKET}/${folder}`,
          Key: file,
          MultipartUpload: {
              Parts: sortedUploads
          },
          UploadId,
      }).promise()
  })

    // await fs.promises.unlink(filePath);

    return file;

    //   await fs.promises.unlink(filePath);

    //   return file;
    // }

    // if (!ContentType) {
    //   throw new AppError('Error Content Type!');
    // }

    // await this.client
    //   .putObject({
    //     Bucket: `${process.env.AWS_BUCKET}/${folder}`,
    //     Key: file,
    //     ACL: 'public-read',
    //     Body: fileContent,
    //     ContentType,
    //   })
    //   .promise();

    // await fs.promises.unlink(filePath);

    // return file;
  }
}

export default S3StorageProvider;
