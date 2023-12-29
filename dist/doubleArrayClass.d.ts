import BC from "./bc.js";
import { BCCalc, Key } from "./types.js";
export default class DoubleArray {
    bc: BC;
    /**
     * Factory method of double array
     */
    constructor(bc: BC);
    /**
     * Look up a given key in this trie
     *
     * @param {String} key
     * @return {Boolean} True if this trie contains a given key
     */
    contain(key: string): boolean;
    /**
     * Look up a given key in this trie
     *
     * @param {String} key
     * @return {Number} Record value assgned to this key, -1 if this key does not contain
     */
    lookup(key: string): number;
    /**
     * Common prefix search
     *
     * @param {String} key
     * @return {Array} Each result object has 'k' and 'v' (key and record,
     * respectively) properties assigned to matched string
     */
    commonPrefixSearch(key: string): Partial<Key>[];
    traverse(parent: number, code: number): number;
    size(): number;
    calc(): BCCalc;
    dump(): string;
}
