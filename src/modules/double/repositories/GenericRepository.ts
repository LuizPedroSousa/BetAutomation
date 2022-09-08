export interface GenericRepository<T> {
  add(data: T): Promise<T>;
  updateById(data: T): Promise<T>;
  findById(id: string): Promise<T>;
}
