import {
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Catch,
  Logger
} from '@nestjs/common';
import { Nuxt } from 'nuxt';

const log = new Logger('NuxtFastifyFilter');

@Catch()
export class NuxtFastifyFilter implements ExceptionFilter {
  private readonly nuxt: Nuxt;

  constructor(nuxt: Nuxt) {
    log.debug('Created NuxtFastifyFilter');

    this.nuxt = nuxt;
  }

  public async catch(
    exception: HttpException,
    host: ArgumentsHost
  ): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const status = exception.getStatus();

    const sharedReq = req.raw;
    const sharedRes = res.res;

    sharedReq.fastifyRequest = req;
    sharedRes.fastifyReply = res;

    log.debug(`Created NuxtFastifyFilter : ${status}`);

    if (status === 404) {
      if (!res.headersSent) {
        log.debug(`Rendering Nuxt`);

        await this.nuxt.render(sharedReq, sharedRes);
      }
    } else {
      res.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url
      } as any);
    }
  }
}
