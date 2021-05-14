import { TypeObject } from "./TypeObject";

export type toJSONThink<T extends string = any> = () => TypeObject<T>;
