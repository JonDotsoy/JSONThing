import { jsonthink } from ".";

// @ts-ignore
if (typeof globalThis.jsonthink === "undefined") {
  // @ts-ignore
  globalThis.jsonthink = jsonthink;
}
