import { resolve } from 'path';
import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;

  storage: StorageEngine;

  // config: {
  //   disk: {};
  //   aws: {
  //     bucket: string;
  //   };
  // };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const { filename } = request.query;

      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${filename || fileHash}@${file.originalname}`;

      return callback(null, fileName);
    },
  }),
} as IUploadConfig;

// interface IUploadConfig {
//   driver: 's3' | 'disk';

//   tmpFolder: string;
//   uploadsFolder: string;

//   multer: {
//     storage: StorageEngine;
//   };

//   config: {
//     disk: {};
//     aws: {
//       bucket: string;
//     };
//   };
// }

// export default {
//   driver: process.env.STORAGE_DRIVER,

//   tmpFolder,
//   uploadsFolder: path.resolve(tmpFolder, 'uploads'),

//   multer: {
//     storage: multer.diskStorage({
//       destination: tmpFolder,
//       filename(req, file, cb) {
//         const fileHash = crypto.randomBytes(10).toString('hex');
//         const fileName = `${fileHash}-${file.originalname}`;

//         return cb(null, fileName);
//       },
//     }),
//   },

//   config: {
//     disk: {},
//     aws: {
//       bucket: 'app-samasc-upload-files',
//     },
//   },
// } as IUploadConfig;
