import { descriptor } from "../descriptor";

export const BigIntDescriptor: descriptor<"BigInt", BigInt> = {
  test: (v) => typeof v === "bigint",
  toJSONThink: (v) => ({
    $$type: "BigInt",
    value: v.toString(),
  }),
  fromJSONThink: (v) => BigInt(v.value),
};
