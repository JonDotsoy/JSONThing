import { TypeObject } from "./TypeObject";

export type toJSONThinkWithVal<T extends string = any, R = any> = (
  val: R
) => TypeObject<T>;
