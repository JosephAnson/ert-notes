import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectParams, GetProjectParams } from './dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async create(@Body() params: ProjectParams) {
    return await this.projectService.create(params);
  }

  @Post('get')
  async get(@Body() params: GetProjectParams) {
    return await this.projectService.getById({
      id: params.id
    });
  }

  @Post('update')
  async updateData(@Body() params: ProjectParams) {
    return await this.projectService.create(params);
  }
}
