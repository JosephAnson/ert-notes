import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import config from '../app.config';
import { NuxtFastifyFilter } from './nuxt/nuxtFastify.filter';
import { NuxtServer } from './nuxt';
import { AppModule } from './app.module';

const log = new Logger('Bootstrap');

declare const module: any;

(async function bootstrap() {
  try {
    const port = config.port;
    const host = config.host;
    let nuxt;

    if (module.hot && module.hot._main) {
      nuxt = await NuxtServer.getInstance().run(false);
    } else {
      nuxt = await NuxtServer.getInstance().run();
    }

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
    );

    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalFilters(await new NuxtFastifyFilter(nuxt));

    if (config.production) {
      app.enableShutdownHooks();

      const signals = ['SIGTERM', 'SIGINT'] as const;
      signals.forEach((signal) => {
        process.on(signal, async () => {
          log.log(`[${signal}] received, closing App`);

          await nuxt.close();
          await app.close();

          log.log(`[${signal}] App closed`);
        });
      });
    }

    if (module && module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    await app.listen(Number(port), host, () => {
      log.log(`Server listening at ${host}:${port}`);
      // log.log(`Server listening at ${config.env.domain}`);
    });
  } catch (e) {
    log.error(e.message, e.trace);
  }
})();
