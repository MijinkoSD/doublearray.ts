import { ArrayBuffer, BCCalc, BCValue } from "./types";
export default class BC {
    initial_size: number;
    first_unused_node: number;
    base: BCValue;
    check: BCValue;
    constructor(initial_size?: number | null);
    initBase(_base: ArrayBuffer, start: number, end: number): void;
    initCheck(_check: ArrayBuffer, start: number, end: number): void;
    realloc(min_size: number): void;
    getBaseBuffer(): ArrayBuffer;
    getCheckBuffer(): ArrayBuffer;
    loadBaseBuffer(base_buffer: ArrayBuffer): this;
    loadCheckBuffer(check_buffer: ArrayBuffer): this;
    size(): number;
    getBase(index: number): number;
    getCheck(index: number): number;
    setBase(index: number, base_value: number): void;
    setCheck(index: number, check_value: number): void;
    setFirstUnusedNode(index: number): void;
    getFirstUnusedNode(): number;
    shrink(): void;
    calc(): BCCalc;
    dump(): string;
}
