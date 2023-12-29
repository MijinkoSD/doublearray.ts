import type { ArrayBuffer } from "./types.js";
export declare const newArrayBuffer: (signed: boolean, bytes: number, size: number) => ArrayBuffer;
export declare const arrayCopy: (src: ArrayBuffer, src_offset: number, length: number) => Uint8Array;
/**
 * Convert String (UTF-16) to UTF-8 ArrayBuffer
 *
 * @param {String} str UTF-16 string to convert
 * @return {Uint8Array} Byte sequence encoded by UTF-8
 */
export declare const stringToUtf8Bytes: (str: string) => Uint8Array | null;
/**
 * Convert UTF-8 ArrayBuffer to String (UTF-16)
 *
 * @param {Uint8Array} bytes UTF-8 byte sequence to convert
 * @return {String} String encoded by UTF-16
 */
export declare const utf8BytesToString: (bytes: Uint8Array) => string;
