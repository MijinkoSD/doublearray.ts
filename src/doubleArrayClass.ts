import BC from "./bc.js";
import { NOT_FOUND, ROOT_ID, TERM_CHAR, TERM_CODE } from "./properties.js";
import { BCCalc, Key } from "./types.js";
import {
  arrayCopy,
  stringToUtf8Bytes,
  utf8BytesToString,
} from "./utilities.js";

export default class DoubleArray {
  bc: BC;

  /**
   * Factory method of double array
   */
  constructor(bc: BC) {
    this.bc = bc; // BASE and CHECK
    this.bc.shrink();
  }

  /**
   * Look up a given key in this trie
   *
   * @param {String} key
   * @return {Boolean} True if this trie contains a given key
   */
  contain(key: string): boolean {
    var bc = this.bc;

    key += TERM_CHAR;
    var buffer = stringToUtf8Bytes(key);
    if (buffer === null) return false;

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
      } else {
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
  lookup(key: string): number {
    key += TERM_CHAR;
    var buffer = stringToUtf8Bytes(key);
    if (buffer === null) return NOT_FOUND;

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
    } else {
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
  commonPrefixSearch(key: string): Partial<Key>[] {
    var buffer = stringToUtf8Bytes(key);
    if (buffer === null) return [];

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

          var r: Partial<Key> = {};

          if (base <= 0) {
            // If child is a leaf node, add record to result
            r.v = -base - 1;
          }

          // If child is a leaf node, add word to result
          r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1));

          result.push(r);
        }
        continue;
      } else {
        break;
      }
    }

    return result;
  }

  traverse(parent: number, code: number): number {
    var child = this.bc.getBase(parent) + code;
    if (this.bc.getCheck(child) === parent) {
      return child;
    } else {
      return NOT_FOUND;
    }
  }

  size(): number {
    return this.bc.size();
  }

  calc(): BCCalc {
    return this.bc.calc();
  }

  dump(): string {
    return this.bc.dump();
  }
}
