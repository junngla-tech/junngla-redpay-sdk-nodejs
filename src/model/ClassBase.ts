import { plainToClassFromExist } from "class-transformer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ClassBase<T = Record<string, any>> {
  constructor(data?: Partial<T> | string) {
    if (data) {
      this.transform(data);
      this.validateReadonlyProperties(data);
    }
  }

  private transform(
    data: Partial<T> | string,
    options: { ignoreDecorators?: boolean } = { ignoreDecorators: true }
  ): this {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        /* empty */
      }
    }

    if (typeof data === "object" && data !== null) {
      plainToClassFromExist(this, data, options);
    }

    return this;
  }

  private validateReadonlyProperties(data: Partial<T> | string): void {
    if (typeof data === "object" && data !== null) {
      const readonlyKeys = Object.getOwnPropertyNames(this).filter((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(this),
          key
        );
        return descriptor?.writable === false && descriptor?.set === undefined;
      });

      readonlyKeys.forEach((key) => {
        if (key in data) {
          throw new Error(`Property "${key}" is readonly and cannot be assigned.`);
        }
      });
    }
  }
}
