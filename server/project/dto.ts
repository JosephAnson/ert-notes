export class CssOptions {
  [x: string]: string;
}

export class CreateProjectParams {
  name?: string;
  sassOptions?: CssOptions;
}

export class UpdateProjectParams {
  name?: string;
  sassOptions?: CssOptions;
}

export class ProjectResponseDTO {
  id!: string;
  name!: string;
  css!: string;
}
