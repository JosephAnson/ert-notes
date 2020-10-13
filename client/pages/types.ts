import Quill from 'quill';
import { Guid } from '~/shared/guid';

export enum TemplateOption {
  Default = 'Default',
  Empty = 'Empty'
}

export interface Editor {
  value: string;
  editorRef: Quill | null;
}

export enum GroupType {
  HEALER = 'Healers',
  DAMAGE = 'Damage Dealers',
  TANK = 'Tanks',
  PLAYER = 'Players'
}

export interface Group {
  id: Guid;
  type: GroupType;
  players: string[];
  editor: Editor;
}

export interface SaveDataDTO {
  editor: Editor;
  groups: Group[];
}
