// Copyright (c) 2014 Takuya Asano All Rights Reserved.

import BC from "./bc";
import DoubleArrayBuilder from "./doubleArrayBuilder";
import DoubleArray from "./doubleArrayClass";
import type { ArrayBuffer } from "./types";

("use strict");

// public methods
const doublearray = {
  builder: function (initial_size?: number) {
    return new DoubleArrayBuilder(initial_size);
  },
  load: function (
    base_buffer: ArrayBuffer,
    check_buffer: ArrayBuffer
  ): DoubleArray {
    var bc = new BC(0);
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
