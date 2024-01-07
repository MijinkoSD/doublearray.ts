# Double-Array

TypeScript implementation of Double-Array trie.

## Usage

### Build

Node.js example

```js
import doublearray from "doublearray.ts";

const words = [
  { k: "a", v: 1 },
  { k: "abc", v: 2 },
  { k: "奈良", v: 3 },
  { k: "奈良先端", v: 4 },
  { k: "奈良先端科学技術大学院大学", v: 5 },
];

const trie = doublearray.builder().build(words);
```

Browser example

```js
var words = [
  { k: "a", v: 1 },
  { k: "abc", v: 2 },
  { k: "奈良", v: 3 },
  { k: "奈良先端", v: 4 },
  { k: "奈良先端科学技術大学院大学", v: 5 },
];

var trie = doublearray.builder().build(words);
```

Method chaining

```js
var trie = doublearray
  .builder()
  .append("a", 1)
  .append("abc", 2)
  .append("奈良", 3)
  .append("奈良先端", 4)
  .append("奈良先端科学技術大学院大学", 5)
  .build();
```

### Search

```js
trie.contain("a"); // -> true

trie.lookup("abc"); // -> 2

trie.commonPrefixSearch("奈良先端科学技術大学院大学");
// -> [ { v: 3, k: '奈良' },
//      { v: 4, k: '奈良先端' },
//      { v: 5, k: '奈良先端科学技術大学院大学' } ]
```

### Load

Get BASE or CHECK buffer as Int32Array of typed array

```js
const base_buffer = trie.bc.getBaseBuffer();
const check_buffer = trie.bc.getCheckBuffer();
```

Load and create a new DoubleArray object from original buffers

```js
const loaded_trie = doublearray.load(base_buffer, check_buffer);
```

## Copyright and license

Copyright (c) 2014 Takuya Asano All Rights Reserved.

This software is released under the MIT License.
See LICENSE.txt
