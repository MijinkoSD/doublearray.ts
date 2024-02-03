import { describe, expect, it } from "vitest";
import { stringToUtf8Bytes, utf8BytesToString } from "../src/utilities.ts";

describe("Test of stringToUtf8Bytes", () => {
  it("Test whether 𠮷野屋 can be converted", () => {
    const bytes = stringToUtf8Bytes("𠮷野屋");
    expect(bytes).toEqual(
      new Uint8Array([
        240, // F0 A0 AE B7: 𠮷
        160,
        174,
        183,
        233, // E9 87 8E: 野
        135,
        142,
        229, // E5 B1 8B: 屋
        177,
        139,
      ])
    );
  });
});

describe("Test of utf8BytesToString", () => {
  it("Test whether 𠮷野屋 can be converted", () => {
    const bytes = utf8BytesToString(
      new Uint8Array([
        240, // F0 A0 AE B7: 𠮷
        160,
        174,
        183,
        233, // E9 87 8E: 野
        135,
        142,
        229, // E5 B1 8B: 屋
        177,
        139,
      ])
    );
    expect(bytes).toBe("𠮷野屋");
  });
});
