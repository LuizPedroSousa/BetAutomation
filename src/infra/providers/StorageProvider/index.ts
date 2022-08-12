import { container } from 'tsyringe';
import { DiskStorageProvider } from './adapters/DiskStorageProvider';
import { StorageProvider } from './ports/StorageProvider';

container.registerSingleton<StorageProvider>('StorageProvider', DiskStorageProvider);
