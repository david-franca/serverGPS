export class ExtendedModel {
  private id: number;
  private attributes: Map<string, boolean | string | number | any>;

  constructor() {
    this.attributes = new Map();
  }

  /**
   * getAttributes
   */
  public getAttributes(): Map<string, any> {
    return this.attributes;
  }

  /**
   * setAttributes
   */
  public setAttributes(attributes: Map<string, any>): void {
    this.attributes = attributes;
  }

  /**
   * getId
   */
  public getId(): number {
    return this.id;
  }

  /**
   * setId
   */
  public setId(id: number) {
    this.id = id;
  }

  /**
   * set
   * @param key value to
   */
  public set<T>(key: string, value: T): void {
    // if (value) {
    this.attributes.set(key, value);
    // }
  }

  /**
   * add
   */
  public add(entry: Map<string, any>): void {
    if (entry && entry.size > 0) {
      for (const keyValue of entry.entries()) {
        this.attributes.set(keyValue[0], keyValue[1]);
      }
    }
  }

  /**
   * getString
   */
  public getString(key: string): string {
    const valid = <string>this.attributes.get(key);
    return valid || null;
  }

  /**
   * getBoolean
   */
  public getBoolean(key: string): boolean {
    const valid = <boolean>this.attributes.get(key);
    return valid || false;
  }

  /**
   * getInteger
   */
  public getInteger(key: string): number {
    const valid = parseInt(<string>this.attributes.get(key));
    return valid || 0;
  }

  /**
   * getFloat
   */
  public getFloat(key: string): number {
    const valid = parseFloat(<string>this.attributes.get(key));
    return valid || 0.0;
  }

  /**
   * getAny
   */
  public getAny<T>(key: string): T {
    const valid = <T>this.attributes.get(key);
    return valid || null;
  }
}
