import { HttpResponse } from './HttpResponse';
import { HttpRequest } from './HttpRequest';

interface JSONResponseDTO {
  status: number;
  message?: string;
  data?: any;
}
import { JobRequest } from './JobRequest';

export abstract class BaseJob {
  protected req: JobRequest;

  protected abstract handle(request?: JobRequest): Promise<void>;

  public async execute(req: JobRequest): Promise<void | any> {
    this.req = req;
    return this.handle(this.req);
  }
}
