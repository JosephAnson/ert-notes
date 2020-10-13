import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@/project/project';
import config from '../app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.typeorm,
      url: config.typeorm.url,
      type: config.typeorm.type,
      synchronize: config.typeorm.synchronize,
      entities: [Project]
    }),
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
