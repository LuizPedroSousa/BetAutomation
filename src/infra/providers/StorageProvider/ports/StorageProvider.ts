import { Either } from '@shared/either';

export interface StorageProvider {
  writeFile(file_identifier: string, data: any): Promise<void>;
  dropFolder(folder?: string): Promise<void>;
  getFilePath(file_identifier?: string): string;
  getFile(file_identifier: string): Promise<Either<any, any>>;
}
