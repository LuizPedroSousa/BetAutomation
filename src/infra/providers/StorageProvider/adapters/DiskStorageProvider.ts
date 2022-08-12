import { uploadConfig } from '@config/upload';
import { Either, left, right } from '@shared/either';
import fs from 'fs';
import path from 'path';
import { injectable } from 'tsyringe';
import util from 'util';
import { StorageProvider } from '../ports/StorageProvider';

@injectable()
export class DiskStorageProvider implements StorageProvider {
  public async writeFile(file_identifier: string, data: any) {
    const filePath = path.resolve(uploadConfig.tmpFolder, file_identifier);

    await util.promisify(fs.writeFile)(filePath, data);
  }

  public async getFile(file_identifier: string): Promise<Either<any, any>> {
    const filePath = path.resolve(uploadConfig.tmpFolder, file_identifier);

    try {
      const file = await util.promisify(fs.readFile)(filePath);

      return right(file);
    } catch (error: any) {
      return left(error.message);
    }
  }

  public async dropFolder(folder?: string) {
    const testPath = path.resolve(uploadConfig.tmpFolder, folder || './');

    await new Promise<void>((resolve, reject) => {
      fs.readdir(testPath, (err, files) => {
        if (err) {
          reject(err);
        }

        const result = files || [];

        result.forEach(file => {
          fs.unlink(path.join(testPath, file), err => {
            if (err) {
              reject(err);
            }
          });
        });

        resolve();
      });
    });
  }

  public getFilePath(file_identifier: string) {
    return path.resolve(uploadConfig.tmpFolder, file_identifier);
  }
}
