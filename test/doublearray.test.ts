// Copyright (c) 2014 Takuya Asano All Rights Reserved.

import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import doublearray from "../src/doublearray.js";
import DoubleArray from "../src/doubleArrayClass.js";

describe("doublearray", () => {
  //   before(function (done) {
  //     done();
  //   });
  describe("contain", () => {
    let trie: DoubleArray; // target
    const dict = {
      apple: 1,
      ball: 2,
      bear: 3,
      bird: 4,
      bison: 5,
      black: 6,
      blue: 7,
      blur: 8,
      cold: 10,
      column: 11,
      cow: 12,
    };
    let words: { k: string; v: number }[] = [];
    for (const key in dict) {
      words.push({ k: key, v: dict[key] });
    }
    it("Contain bird", () => {
      trie = doublearray.builder().build(words);
      expect(trie.contain("bird")).to.be.true;
    });
    it("Contain bison", () => {
      trie = doublearray.builder().build(words);
      expect(trie.contain("bison")).to.be.true;
    });
    it("Lookup bird", () => {
      trie = doublearray.builder().build(words);
      expect(trie.lookup("bird")).to.be.eql(dict["bird"]);
    });
    it("Lookup bison", () => {
      trie = doublearray.builder().build(words);
      expect(trie.lookup("bison")).to.be.eql(dict["bison"]);
    });
    it("Build", () => {
      trie = doublearray.builder(4).build(words);
      // trie.bc.
      expect(trie.lookup("bison")).to.be.eql(dict["bison"]);
    });
  });
  describe("load", () => {
    let trie: DoubleArray; // target
    let load_trie: DoubleArray; // target
    const words = [{ k: "apple", v: 1 }]; // test data
    beforeEach(() => {
      // Build original
      trie = doublearray.builder().build(words);

      // Load from original typed array
      let base_buffer = trie.bc.getBaseBuffer();
      let check_buffer = trie.bc.getCheckBuffer();
      load_trie = doublearray.load(base_buffer, check_buffer);
    });
    it("Original and loaded tries lookup successfully", () => {
      expect(trie.lookup("apple")).to.be.eql(words[0].v);
      expect(load_trie.lookup("apple")).to.be.eql(words[0].v);
    });
    it("Original and loaded typed arrays are same", () => {
      expect(trie.bc.getBaseBuffer()).toEqual(load_trie.bc.getBaseBuffer());
      expect(trie.bc.getCheckBuffer()).toEqual(load_trie.bc.getCheckBuffer());
    });
  });
});

describe("test from README.md", () => {
  let trie: DoubleArray;
  beforeAll(() => {
    const words = [
      { k: "a", v: 1 },
      { k: "abc", v: 2 },
      { k: "奈良", v: 3 },
      { k: "奈良先端", v: 4 },
      { k: "奈良先端科学技術大学院大学", v: 5 },
      { k: "ト", v: 6 },
      { k: "トト", v: 7 },
      { k: "トトロ", v: 8 },
    ];
    trie = doublearray.builder().build(words);
  });

  it("contain", () => {
    expect(trie.contain("a")).toBeTruthy();
  });

  it("lookup", () => {
    expect(trie.lookup("abc")).toBe(2);
  });

  it("commonPrefixSearch", () => {
    expect(trie.commonPrefixSearch("奈良先端科学技術大学院大学")).toEqual([
      { v: 3, k: "奈良" },
      { v: 4, k: "奈良先端" },
      { v: 5, k: "奈良先端科学技術大学院大学" },
    ]);
  });

  it("commonPrefixSearch2", () => {
    expect(trie.commonPrefixSearch("トトロ")).toEqual([
      { v: 6, k: "ト" },
      { v: 7, k: "トト" },
      { v: 8, k: "トトロ" },
    ]);
  });
});
