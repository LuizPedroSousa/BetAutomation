import { container } from 'tsyringe';
import { BetsRepository } from '../repositories/BetsRepository';
import { RoundsRepository } from '../repositories/RoundsRepository';
import { PrismaBetsRepository } from './orm/repositories/PrismaBetsRepository';
import { PrismaRoundsRepository } from './orm/repositories/PrismaRoundsRepository';

container.registerSingleton<BetsRepository>('BetsRepository', PrismaBetsRepository);
container.registerSingleton<RoundsRepository>('RoundsRepository', PrismaRoundsRepository);
