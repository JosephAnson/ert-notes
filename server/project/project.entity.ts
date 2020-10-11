import { Column, Entity } from 'typeorm';
import { Base } from '@/common/base.entity';

@Entity('project')
export class ProjectEntity extends Base {
  @Column({
    default: 'New Project'
  })
  name!: string;

  @Column()
  optionsHash!: string;

  @Column()
  compiledCss!: string;
}
