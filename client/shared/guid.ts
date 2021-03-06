export class Guid {
  public static validator = new RegExp(
    '^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$',
    'i'
  );

  public static EMPTY = '00000000-0000-0000-0000-000000000000';

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static isGuid(guid: any): boolean {
    const value: string = guid;
    return guid && Guid.validator.test(value);
  }

  public static create(guid?: string): string {
    if (guid && this.isGuid(guid)) return guid;
    return [
      Guid.gen(2),
      Guid.gen(1),
      Guid.gen(1),
      Guid.gen(1),
      Guid.gen(3)
    ].join('-');
  }

  public static createWithoutSlash(guid?: string): string {
    if (guid && this.isGuid(guid)) return guid;
    return [
      Guid.gen(2),
      Guid.gen(1),
      Guid.gen(1),
      Guid.gen(1),
      Guid.gen(3)
    ].join('');
  }

  private static gen(count: number) {
    let out = '';
    for (let i = 0; i < count; i++) {
      // tslint:disable-next-line:no-bitwise
      out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return out;
  }
}
