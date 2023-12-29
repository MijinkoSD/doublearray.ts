import BC from "./bc.js";
import DoubleArray from "./doubleArrayClass.js";
import { Key } from "./types.js";
export default class DoubleArrayBuilder {
    bc: BC;
    keys: Key[];
    /**
     * Factory method of double array
     */
    constructor(initial_size?: number | null);
    /**
     * Append a key to initialize set
     * (This method should be called by dictionary ordered key)
     *
     * @param {String} key
     * @param {Number} value Integer value from 0 to max signed integer number - 1
     */
    append(key: string, record: number): this;
    /**
     * Build double array for given keys
     *
     * @param {Array} keys Array of keys. A key is a Object which has properties 'k', 'v'.
     * 'k' is a key string, 'v' is a record assigned to that key.
     * @return {DoubleArray} Compiled double array
     */
    build(keys?: Key[] | null, sorted?: boolean | null): DoubleArray;
    /**
     * Append nodes to BASE and CHECK array recursively
     */
    _build(parent_index: number, position: number, start: number, length: number): void;
    getChildrenInfo(position: number, start: number, length: number): Int32Array;
    setBC(parent_id: number, children_info: Int32Array, _base: number): void;
    /**
     * Find BASE value that all children are allocatable in double array's region
     */
    findAllocatableBase(children_info: Int32Array): number;
    /**
     * Check this double array index is unused or not
     */
    isUnusedNode(index: number): boolean;
}
