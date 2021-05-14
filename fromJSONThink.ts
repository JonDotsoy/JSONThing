import { TypeObject } from "./TypeObject";

export type fromJSONThink<T extends string = any, R = any> = (
  value: TypeObject<T>
) => R;
