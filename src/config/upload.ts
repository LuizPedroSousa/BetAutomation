import path from 'path';

interface UploadConfig {
  tmpFolder: string;
  uploadsFolder: string;
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

const uploadConfig: UploadConfig = {
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
};

export { uploadConfig };
