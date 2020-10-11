import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectParams, UpdateProjectParams } from './dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  createProject(@Body() params: CreateProjectParams) {
    return this.projectService.createProject({
      name: params.name,
      sassOptions: params.sassOptions
    });
  }

  @Post(':id')
  updateProject(@Param('id') id: string, @Body() params: UpdateProjectParams) {
    return this.projectService.updateProject(id, params);
  }

  @Get(':id/css')
  projectCss(@Param('id') id: string, @Response() res: any) {
    const projectCSS = this.projectService.projectCss(id);

    res.type('.css');

    return projectCSS.then((css) => res.send(css));
  }
}
