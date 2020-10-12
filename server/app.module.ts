import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from '@/project/project.entity';
import config from '../app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.typeorm,
      entities: [ProjectEntity]
    }),
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
