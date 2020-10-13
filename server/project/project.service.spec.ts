import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '@/project/project.controller';
import { Repository } from 'typeorm';
import { Project } from '@/project/project';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
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

    /***
     * Mock Repo calls
     */

    jest.spyOn(repo, 'create').mockImplementation((result: any) => {
      return { id: '494f8df5-ae0b-41d2-93e0-0afc165e292a', ...result };
    });

    jest.spyOn(repo, 'save').mockImplementation();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
