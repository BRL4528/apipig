export default interface IStorageProvider {
  save(file: string, folder: string): Promise<string>;
  saveMultiPart(file: string, folder: string): Promise<string>;
  delete(file: string, folder: string): Promise<void>;
}
