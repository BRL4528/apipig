/* eslint-disable @typescript-eslint/interface-name-prefix */
declare namespace Express {
  export interface Request {
    access: {
      id: string;
    };
    user: {
      nickname: string;
    };
  }
}
