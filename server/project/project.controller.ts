import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectParams } from './dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  createProject(@Body() params: CreateProjectParams) {
    return this.projectService.createProject({
      name: params.name
    });
  }
}
