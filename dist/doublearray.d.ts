import DoubleArrayBuilder from "./doubleArrayBuilder";
import DoubleArray from "./doubleArrayClass";
import type { ArrayBuffer } from "./types";
declare const doublearray: {
    builder: (initial_size?: number) => DoubleArrayBuilder;
    load: (base_buffer: ArrayBuffer, check_buffer: ArrayBuffer) => DoubleArray;
};
export default doublearray;
