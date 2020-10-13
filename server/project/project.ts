import { Column, Entity } from 'typeorm';
import { Base } from '@/common/base.entity';

@Entity('project')
export class Project extends Base {
  @Column({
    default: ''
  })
  data!: string;
}
