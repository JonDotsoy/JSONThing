import { fromJSONThink } from "./fromJSONThink";
import { toJSONThinkWithVal } from "./toJSONThinkWithVal";

export interface descriptor<T extends string = any, R = any> {
  test(val: any): boolean;
  toJSONThink: toJSONThinkWithVal<T, R>;
  fromJSONThink: fromJSONThink<T, R>;
}
