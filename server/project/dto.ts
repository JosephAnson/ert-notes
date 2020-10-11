export class CssOptions {
  [x: string]: string;
}

export class CreateProjectParams {
  name?: string;
}

export class UpdateProjectParams {
  name?: string;
}

export class ProjectResponseDTO {
  id!: string;
  name!: string;
}
