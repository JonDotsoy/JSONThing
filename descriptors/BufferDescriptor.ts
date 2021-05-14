import { descriptor } from "../descriptor";

export const BufferDescriptor: descriptor<"Buffer", Buffer> = {
  test: (v) => v instanceof Buffer,
  toJSONThink: (v) => ({
    $$type: "Buffer",
    data: v.toJSON().data,
  }),
  fromJSONThink: (v) => Buffer.from(v.data),
};
