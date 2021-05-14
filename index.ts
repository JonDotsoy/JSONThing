import { descriptor } from "./descriptor";
import { BigIntDescriptor } from "./descriptors/BigIntDescriptor";
import { BufferDescriptor } from "./descriptors/BufferDescriptor";
import { DateDescriptor } from "./descriptors/DateDescriptor";
import { fromJSONThink } from "./fromJSONThink";
import { obj } from "./obj";
import { toJSONThink } from "./toJSONThink";
import { toJSONThinkWithVal } from "./toJSONThinkWithVal";

const pipe = (vale: any) => {
  let currentValue = vale;
  const self = {
    pipe(fn: (value: any) => any) {
      currentValue = fn(currentValue);
      return this;
    },
    valueOf() {
      return currentValue;
    },
  };

  return self;
};

export const withToJSONThink = (
  value: any
): value is obj<{ toJSONThink: toJSONThink }> =>
  typeof value === "object" ? typeof value.toJSONThink === "function" : false;
export const withToJSONThinkWithValue = (
  value: any
): value is obj<{ toJSONThink: toJSONThinkWithVal }> =>
  typeof value === "object" ? typeof value.toJSONThink === "function" : false;
export const withFromJSONThink = (
  value: any
): value is obj<{ fromJSONThink: fromJSONThink }> => {
  const typeValue = typeof value;
  return typeValue === "object" || typeValue === "function"
    ? typeof value.fromJSONThink === "function"
    : false;
};
export const isObjectKeyType = <K extends string = "$$type">(
  value: any,
  propTypeName = <K>"$$type"
): value is obj<{ [k in K]: string }> =>
  typeof value === "object" ? typeof value[propTypeName] === "string" : false;
export const isTransformDescription = (value: any): value is obj<descriptor> =>
  typeof value === "object"
    ? typeof value.test === "function" &&
      withToJSONThinkWithValue(value) &&
      withFromJSONThink(value)
    : false;

const globalDescriptores = new Map<string, descriptor>();

globalDescriptores.set("Date", DateDescriptor);
globalDescriptores.set("BigInt", BigIntDescriptor);
globalDescriptores.set("Buffer", BufferDescriptor);

export class JSONThink<K extends string = "$$type"> {
  constructor(private options?: { propTypeName?: K }) {}

  readonly propTypeName = this.options?.propTypeName ?? "$$type";

  private listThinks = new Map<any, string>();
  private listThinksByName = new Map<string, any>();
  private listThinksDescriptions = globalDescriptores;

  use(ref: any, name?: string) {
    const nameValue = name ?? ref.name;
    this.listThinksByName.set(nameValue, ref);
    if (isTransformDescription(ref)) {
      this.listThinksDescriptions.set(nameValue, ref);
    } else {
      this.listThinks.set(ref, nameValue);
    }
    return this;
  }

  stringify(
    value: any,
    replacer?: (this: any, key: string, value: any) => any,
    space?: string | number
  ) {
    const nextObj = this.deep(value, "", this.replacerLow(replacer));
    return JSON.stringify(nextObj, null, space);
  }

  private deep(
    value: any,
    key: string,
    replacer?: (this: any, key: string, value: any) => any
  ): any {
    const res = pipe(value)
      .pipe((v) => replacer?.(key, value) ?? v)
      .pipe((v) => (typeof v === "object" ? v.toJSON?.() ?? v : v))
      .valueOf();

    if (Array.isArray(res)) {
      return res.map((value, key) =>
        this.deep(value, key.toString(), replacer)
      );
    }

    if (typeof res === "object") {
      const re = Object.entries(res).reduce((a: any, [key, value]) => {
        return {
          ...a,
          [key]: this.deep(value, key, replacer),
        };
      }, {} as { [k: string]: any });

      return re;
    }

    return res;
  }

  replacerLow =
    (replacer?: (this: any, key: string, value: any) => any) =>
    (key: string, value: any) => {
      if (withToJSONThink(value)) {
        const res = value.toJSONThink();
        return {
          ...res,
          [this.propTypeName]: this.listThinks.get(value.constructor),
        };
      }

      if (this.listThinksDescriptions.size) {
        const iterator = this.listThinksDescriptions.entries();

        while (true) {
          const { value: valueIterator, done } = iterator.next();
          if (done) break;
          const [descName, desc] = valueIterator;
          if (desc.test(value)) {
            const res = desc.toJSONThink(value);
            return {
              ...res,
              [this.propTypeName]: descName,
            };
          }
        }
      }

      return typeof replacer === "function" ? replacer(key, value) : value;
    };

  parse(text: string, reviver?: (this: any, key: string, value: any) => any) {
    const reviverP = (key: string, value: any) => {
      if (isObjectKeyType(value, this.propTypeName)) {
        const typeKey = value[this.propTypeName];
        const typeCls = this.listThinksByName.get(typeKey);
        if (withFromJSONThink(typeCls)) {
          return typeCls.fromJSONThink(value);
        }
      }

      return reviver?.(key, value) ?? value;
    };

    return JSON.parse(text, reviverP);
  }
}

export const jsonThink = new JSONThink();
