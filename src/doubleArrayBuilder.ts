import BC from "./bc";
import DoubleArray from "./doubleArrayClass";
import { ROOT_ID, TERM_CHAR, TERM_CODE } from "./properties";
import { Key } from "./types";
import { stringToUtf8Bytes } from "./utilities";

export default class DoubleArrayBuilder {
  bc: BC;
  keys: Key[];

  /**
   * Factory method of double array
   */
  constructor(initial_size?: number | null) {
    this.bc = new BC(initial_size); // BASE and CHECK
    this.keys = [];
  }

  /**
   * Append a key to initialize set
   * (This method should be called by dictionary ordered key)
   *
   * @param {String} key
   * @param {Number} value Integer value from 0 to max signed integer number - 1
   */
  append(key: string, record: number) {
    this.keys.push({ k: key, v: record });
    return this;
  }

  /**
   * Build double array for given keys
   *
   * @param {Array} keys Array of keys. A key is a Object which has properties 'k', 'v'.
   * 'k' is a key string, 'v' is a record assigned to that key.
   * @return {DoubleArray} Compiled double array
   */
  build(keys?: Key[] | null, sorted?: boolean | null): DoubleArray {
    if (keys == null) {
      keys = this.keys;
    }

    if (keys == null) {
      return new DoubleArray(this.bc);
    }

    if (sorted == null) {
      sorted = false;
    }

    // Convert key string to ArrayBuffer
    var buff_keys = keys.map(function (k) {
      return {
        k: stringToUtf8Bytes(k.k + TERM_CHAR),
        v: k.v,
      };
    });

    // Sort keys by byte order
    if (sorted) {
      this.keys = buff_keys;
    } else {
      this.keys = buff_keys.sort(function (k1, k2) {
        const b1 = k1.k;
        const b2 = k2.k;
        if (b1 === null && b2 === null) return 0;
        else if (b1 === null) return -1;
        else if (b2 === null) return 1;

        const min_length = Math.min(b1.length, b2.length);
        for (var pos = 0; pos < min_length; pos++) {
          if (b1[pos] === b2[pos]) {
            continue;
          }
          return b1[pos] - b2[pos];
        }
        return b1.length - b2.length;
      });
    }

    // buff_keys = null; // explicit GC

    this._build(ROOT_ID, 0, 0, this.keys.length);
    return new DoubleArray(this.bc);
  }

  /**
   * Append nodes to BASE and CHECK array recursively
   */
  _build(
    parent_index: number,
    position: number,
    start: number,
    length: number,
  ) {
    var children_info = this.getChildrenInfo(position, start, length);
    var _base = this.findAllocatableBase(children_info);

    this.setBC(parent_index, children_info, _base);

    for (var i = 0; i < children_info.length; i = i + 3) {
      var child_code = children_info[i];
      if (child_code === TERM_CODE) {
        continue;
      }
      var child_start = children_info[i + 1];
      var child_len = children_info[i + 2];
      var child_index = _base + child_code;
      this._build(child_index, position + 1, child_start, child_len);
    }
  }

  getChildrenInfo(
    position: number,
    start: number,
    length: number,
  ): Int32Array {
    const start_key = this.keys[start];
    if (start_key.k === null) return new Int32Array();
    const start_key_k = start_key.k[position];
    var current_char = typeof start_key_k === "number"
      ? start_key_k.toString()
      : start_key_k;
    var i = 0;
    var children_info = new Int32Array(length * 3);

    children_info[i++] = parseInt(current_char); // char (current)
    children_info[i++] = start; // start index (current)

    var next_pos = start;
    var start_pos = start;
    for (; next_pos < start + length; next_pos++) {
      const next_key = this.keys[next_pos];
      if (next_key.k === null) return new Int32Array();
      const next_key_k = next_key.k[position];
      var next_char = typeof next_key_k === "number"
        ? next_key_k.toString()
        : next_key_k;
      if (current_char !== next_char) {
        children_info[i++] = next_pos - start_pos; // length (current)

        children_info[i++] = parseInt(next_char); // char (next)
        children_info[i++] = next_pos; // start index (next)
        current_char = next_char;
        start_pos = next_pos;
      }
    }
    children_info[i++] = next_pos - start_pos;
    children_info = children_info.subarray(0, i);

    return children_info;
  }

  setBC(
    parent_id: number,
    children_info: Int32Array,
    _base: number,
  ) {
    var bc = this.bc;

    bc.setBase(parent_id, _base); // Update BASE of parent node

    var i;
    for (i = 0; i < children_info.length; i = i + 3) {
      var code = children_info[i];
      var child_id = _base + code;

      // Update linked list of unused nodes

      // Assertion
      // if (child_id < 0) {
      //     throw 'assertion error: child_id is negative'
      // }

      var prev_unused_id = -bc.getBase(child_id);
      var next_unused_id = -bc.getCheck(child_id);
      // if (prev_unused_id < 0) {
      //     throw 'assertion error: setBC'
      // }
      // if (next_unused_id < 0) {
      //     throw 'assertion error: setBC'
      // }
      if (child_id !== bc.getFirstUnusedNode()) {
        bc.setCheck(prev_unused_id, -next_unused_id);
      } else {
        // Update first_unused_node
        bc.setFirstUnusedNode(next_unused_id);
      }
      bc.setBase(next_unused_id, -prev_unused_id);

      var check = parent_id; // CHECK is parent node index
      bc.setCheck(child_id, check); // Update CHECK of child node

      // Update record
      if (code === TERM_CODE) {
        var start_pos = children_info[i + 1];
        // var len = children_info[i + 2];
        // if (len != 1) {
        //     throw 'assertion error: there are multiple terminal nodes. len:' + len;
        // }
        var value = this.keys[start_pos].v;

        if (value == null) {
          value = 0;
        }

        var base = -value - 1; // BASE is inverted record value
        bc.setBase(child_id, base); // Update BASE of child(leaf) node
      }
    }
  }

  /**
   * Find BASE value that all children are allocatable in double array's region
   */
  findAllocatableBase(children_info: Int32Array) {
    var bc = this.bc;

    // Assertion: keys are sorted by byte order
    // var c = -1;
    // for (var i = 0; i < children_info.length; i = i + 3) {
    //     if (children_info[i] < c) {
    //         throw 'assertion error: not sort key'
    //     }
    //     c = children_info[i];
    // }

    // iterate linked list of unused nodes
    var _base;
    var curr = bc.getFirstUnusedNode(); // current index
    // if (curr < 0) {
    //     throw 'assertion error: getFirstUnusedNode returns negative value'
    // }

    while (true) {
      _base = curr - children_info[0];

      if (_base < 0) {
        curr = -bc.getCheck(curr); // next

        // if (curr < 0) {
        //     throw 'assertion error: getCheck returns negative value'
        // }

        continue;
      }

      var empty_area_found = true;
      for (var i = 0; i < children_info.length; i = i + 3) {
        var code = children_info[i];
        var candidate_id = _base + code;

        if (!this.isUnusedNode(candidate_id)) {
          // candidate_id is used node
          // next
          curr = -bc.getCheck(curr);
          // if (curr < 0) {
          //     throw 'assertion error: getCheck returns negative value'
          // }

          empty_area_found = false;
          break;
        }
      }
      if (empty_area_found) {
        // Area is free
        return _base;
      }
    }
  }

  /**
   * Check this double array index is unused or not
   */
  isUnusedNode(index: number): boolean {
    var bc = this.bc;
    var check = bc.getCheck(index);

    // if (index < 0) {
    //     throw 'assertion error: isUnusedNode index:' + index;
    // }

    if (index === ROOT_ID) {
      // root node
      return false;
    }
    if (check < 0) {
      // unused
      return true;
    }

    // used node (incl. leaf)
    return false;
  }
}
