import { join } from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { renderSync } from 'node-sass';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { ProjectEntity } from './project.entity';
import {
  CreateProjectParams,
  CssOptions,
  ProjectResponseDTO,
  UpdateProjectParams
} from './dto';

function generateSassVariableString(sassOptions: CssOptions) {
  let string = '';

  for (const [key, value] of Object.entries(sassOptions)) {
    string += `$${key}: ${value};`;
  }

  return string;
}

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>
  ) {}

  async createProject(
    params: CreateProjectParams = {}
  ): Promise<ProjectResponseDTO> {
    const generatedCss = this.generateSassFile(params.sassOptions);

    const project = await this.projectRepository.create({
      name: params.name,
      optionsHash: hashSync(
        params.sassOptions ? JSON.stringify(params.sassOptions) : ''
      ),
      compiledCss: generatedCss
    });

    await this.projectRepository.save(project);

    return {
      id: project.id,
      name: project.name,
      css: project.compiledCss
    };
  }

  generateSassFile(sassOptions?: CssOptions): string {
    let sassVariableString = '';

    if (sassOptions) {
      sassVariableString = generateSassVariableString(sassOptions);
    }

    const sassData =
      "@import 'bulmabuildingblocks/src/initial-variables'; " +
      sassVariableString +
      " @import 'bulma/bulma'; @import 'bulmabuildingblocks/src/main';";

    const result = renderSync({
      // file: filePath,
      data: sassData,
      includePaths: [join(process.cwd(), 'node_modules')],
      outputStyle: 'compressed',
      outFile: '/temp/temp.css',
      sourceMap: true // or an absolute or relative (to outFile) path
    });

    return result.css.toString();
  }

  async updateProject(
    projectId: string,
    params?: UpdateProjectParams
  ): Promise<ProjectResponseDTO> {
    if (!params) {
      throw new HttpException(
        'Nothing passed to update!',
        HttpStatus.FORBIDDEN
      );
    }

    const project:
      | ProjectEntity
      | undefined = await this.projectRepository.findOne(projectId);

    // check database option hash to see if it's the same as the users current, if so just return the same css from the database
    if (
      project &&
      params.sassOptions &&
      project.optionsHash &&
      compareSync(JSON.stringify(params.sassOptions), project.optionsHash)
    ) {
      return {
        id: project.id,
        name: project.name,
        css: project.compiledCss
      };
    }

    // if project doesn't exist create one
    if (!project) {
      return this.createProject({
        name: params.name,
        sassOptions: params.sassOptions
      });
    }

    if (params.name) {
      project.name = params.name;
    }

    if (params.sassOptions) {
      // create a new hash as the new options are different
      project.optionsHash = hashSync(JSON.stringify(params.sassOptions));
      project.compiledCss = this.generateSassFile(params.sassOptions);
    }

    await this.projectRepository.save(project);

    return {
      id: project.id,
      name: project.name,
      css: project.compiledCss
    };
  }

  async projectCss(projectId: string): Promise<string> {
    const project:
      | ProjectEntity
      | undefined = await this.projectRepository.findOne(projectId);

    if (!project) {
      throw new HttpException("Project doesn't exist", HttpStatus.FORBIDDEN);
    }

    return project.compiledCss;
  }
}
