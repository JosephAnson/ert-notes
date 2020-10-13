import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '@/project/project.service';
import { Project } from '@/project/project';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';

describe('Project Controller', () => {
  let controller: ProjectController;
  let service: ProjectService;
  // declaring the repo variable for easy access later
  let repo: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // how you provide the injection token in a test instance
          provide: getRepositoryToken(Project),
          // as a class value, Repository needs no generics
          useClass: Repository
        },
        ProjectService
      ],
      controllers: [ProjectController]
    }).compile();

    controller = module.get<ProjectController>(ProjectController);

    service = module.get<ProjectService>(ProjectService);
    // Save the instance of the repository and set the correct generics
    repo = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
