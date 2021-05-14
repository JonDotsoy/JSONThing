export interface TypeObject<ObjectKey extends string> {
  $$type: ObjectKey;
  [k: string]: any;
}
