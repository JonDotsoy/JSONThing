import { descriptor } from "../descriptor";
import { inspect } from "util";

export const DateDescriptor: descriptor<"Date", Date> = {
  test: (v) => v instanceof Date,
  toJSONThink: (v) => ({
    $$type: "Date",
    date: v.toJSON(),
  }),
  fromJSONThink: (v) => new Date(v.date),
};
