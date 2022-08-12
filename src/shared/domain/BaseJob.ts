import { JobRequest } from './JobRequest';

export abstract class BaseJob {
  protected req: JobRequest;

  protected abstract handle(request?: JobRequest): Promise<void>;

  public async execute(req: JobRequest): Promise<void | any> {
    this.req = req;
    return this.handle(this.req);
  }
}
