import DoubleArrayBuilder from "./doubleArrayBuilder.js";
import DoubleArray from "./doubleArrayClass.js";
import type { ArrayBuffer } from "./types.js";
declare const doublearray: {
    builder: (initial_size?: number) => DoubleArrayBuilder;
    load: (base_buffer: ArrayBuffer, check_buffer: ArrayBuffer) => DoubleArray;
};
export default doublearray;
