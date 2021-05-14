export type obj<T = {}> = T & {
  [k: string]: any;
  [k: number]: any;
};
