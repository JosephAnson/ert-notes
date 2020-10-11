import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '@/project/project.controller';
import { Repository } from 'typeorm';
import { ProjectEntity } from '@/project/project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProjectParams } from '@/project/dto';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let controller: ProjectController;
  let service: ProjectService;
  // declaring the repo variable for easy access later
  let repo: Repository<ProjectEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // how you provide the injection token in a test instance
          provide: getRepositoryToken(ProjectEntity),
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
    repo = module.get<Repository<ProjectEntity>>(
      getRepositoryToken(ProjectEntity)
    );

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

  it('should return for create a css file', async () => {
    const createProjectParams: CreateProjectParams = {
      name: 'my fancier new project'
    };

    const createdProject = await service.createProject(createProjectParams);
    expect(createdProject.name).toEqual(createProjectParams.name);
  });
});
