// Copyright (c) 2014 Takuya Asano All Rights Reserved.

import BC from "./bc.js";
import DoubleArrayBuilder from "./doubleArrayBuilder.js";
import DoubleArray from "./doubleArrayClass.js";
import type { ArrayBuffer } from "./types.js";

// public methods
const doublearray = {
  builder: (initial_size?: number): DoubleArrayBuilder => {
    return new DoubleArrayBuilder(initial_size);
  },
  load: (base_buffer: ArrayBuffer, check_buffer: ArrayBuffer): DoubleArray => {
    const bc = new BC(0);
    bc.loadBaseBuffer(base_buffer);
    bc.loadCheckBuffer(check_buffer);
    return new DoubleArray(bc);
  },
};

if ("undefined" === typeof module) {
  // In browser
  // @ts-ignore
  window.doublearray = doublearray;
} else {
  // In node
  module.exports = doublearray;
}

export default doublearray;
