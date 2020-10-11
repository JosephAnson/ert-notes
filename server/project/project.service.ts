import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { CreateProjectParams, ProjectResponseDTO } from './dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>
  ) {}

  async createProject(
    params: CreateProjectParams = {}
  ): Promise<ProjectResponseDTO> {
    const project = await this.projectRepository.create({
      name: params.name
    });

    await this.projectRepository.save(project);

    return {
      id: project.id,
      name: project.name
    };
  }
}
