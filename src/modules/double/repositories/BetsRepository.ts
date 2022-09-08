import { Bet } from '../domain/Bet/Bet';
import { GenericRepository } from './GenericRepository';

export interface BetsRepository extends GenericRepository<Bet> {}
