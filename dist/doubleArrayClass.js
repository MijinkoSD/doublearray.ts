import { NOT_FOUND, ROOT_ID, TERM_CHAR, TERM_CODE } from "./properties.js";
import { arrayCopy, stringToUtf8Bytes, utf8BytesToString, } from "./utilities.js";
export default class DoubleArray {
    /**
     * Factory method of double array
     */
    constructor(bc) {
        Object.defineProperty(this, "bc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.bc = bc; // BASE and CHECK
        this.bc.shrink();
    }
    /**
     * Look up a given key in this trie
     *
     * @param {String} key
     * @return {Boolean} True if this trie contains a given key
     */
    contain(key) {
        var bc = this.bc;
        key += TERM_CHAR;
        var buffer = stringToUtf8Bytes(key);
        if (buffer === null)
            return false;
        var parent = ROOT_ID;
        var child = NOT_FOUND;
        for (var i = 0; i < buffer.length; i++) {
            var code = buffer[i];
            child = this.traverse(parent, code);
            if (child === NOT_FOUND) {
                return false;
            }
            if (bc.getBase(child) <= 0) {
                // leaf node
                return true;
            }
            else {
                // not leaf
                parent = child;
                continue;
            }
        }
        return false;
    }
    /**
     * Look up a given key in this trie
     *
     * @param {String} key
     * @return {Number} Record value assgned to this key, -1 if this key does not contain
     */
    lookup(key) {
        key += TERM_CHAR;
        var buffer = stringToUtf8Bytes(key);
        if (buffer === null)
            return NOT_FOUND;
        var parent = ROOT_ID;
        var child = NOT_FOUND;
        for (var i = 0; i < buffer.length; i++) {
            var code = buffer[i];
            child = this.traverse(parent, code);
            if (child === NOT_FOUND) {
                return NOT_FOUND;
            }
            parent = child;
        }
        var base = this.bc.getBase(child);
        if (base <= 0) {
            // leaf node
            return -base - 1;
        }
        else {
            // not leaf
            return NOT_FOUND;
        }
    }
    /**
     * Common prefix search
     *
     * @param {String} key
     * @return {Array} Each result object has 'k' and 'v' (key and record,
     * respectively) properties assigned to matched string
     */
    commonPrefixSearch(key) {
        var buffer = stringToUtf8Bytes(key);
        if (buffer === null)
            return [];
        var parent = ROOT_ID;
        var child = NOT_FOUND;
        var result = [];
        for (var i = 0; i < buffer.length; i++) {
            var code = buffer[i];
            child = this.traverse(parent, code);
            if (child !== NOT_FOUND) {
                parent = child;
                // look forward by terminal character code to check this node is a leaf or not
                var grand_child = this.traverse(child, TERM_CODE);
                if (grand_child !== NOT_FOUND) {
                    var base = this.bc.getBase(grand_child);
                    var r = {};
                    if (base <= 0) {
                        // If child is a leaf node, add record to result
                        r.v = -base - 1;
                    }
                    // If child is a leaf node, add word to result
                    r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1));
                    result.push(r);
                }
                continue;
            }
            else {
                break;
            }
        }
        return result;
    }
    traverse(parent, code) {
        var child = this.bc.getBase(parent) + code;
        if (this.bc.getCheck(child) === parent) {
            return child;
        }
        else {
            return NOT_FOUND;
        }
    }
    size() {
        return this.bc.size();
    }
    calc() {
        return this.bc.calc();
    }
    dump() {
        return this.bc.dump();
    }
}
//# sourceMappingURL=doubleArrayClass.js.map