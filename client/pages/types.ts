import Quill from 'quill';
import { Guid } from '~/shared/guid';

export enum TemplateOption {
  Default = 'Default',
  Empty = 'Empty'
}

export interface Editor {
  value: string;
  players?: Player[];
  editorRef: Quill | null;
}

export enum GroupType {
  HEALER = 'Healers',
  DAMAGE = 'Damage Dealers',
  TANK = 'Tanks',
  PLAYER = 'Players'
}

export enum WowClasses {
  deathknight = 'Death Knight',
  druid = 'Druid',
  hunter = 'Hunter',
  mage = 'Mage',
  monk = 'Monk',
  paladin = 'Paladin',
  priest = 'Priest',
  rogue = 'Rogue',
  shaman = 'Shaman',
  warlock = 'Warlock',
  warrior = 'Warrior',
  demonhunter = 'Demon Hunter'
}

export interface Player {
  id: Guid;
  name: string;
  class: WowClasses;
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
  players: Player[];
}
