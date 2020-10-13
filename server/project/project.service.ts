import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'server/project/project';
import { GetProjectParams, ProjectResponseDTO, ProjectParams } from './dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  async create(params: ProjectParams): Promise<ProjectResponseDTO> {
    const project = new Project();

    if (params.id) {
      project.id = params.id;
    }

    project.data = params.data || '';

    await project.save();

    return {
      id: project.id,
      data: project.data
    };
  }

  async getById(
    params: GetProjectParams
  ): Promise<ProjectResponseDTO | boolean> {
    return await this.projectRepository.findOne(params.id);
  }

  async updateData(params: ProjectParams): Promise<ProjectResponseDTO> {
    const project = await this.projectRepository.findOne(params.id);

    project.data = params.data;

    await this.projectRepository.save(project);

    return {
      id: project.id,
      data: project.data
    };
  }
}
