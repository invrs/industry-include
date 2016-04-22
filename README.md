# IndustryInclude [![Build Status](https://travis-ci.org/invrs/industry-include.svg?branch=master)](https://travis-ci.org/invrs/industry-include)

Provides a dependency tree object to your method parameters.

## Usage

Given you have `files/files.test.js` at `${__dirname}`:

```js
import { factory } from "industry"
import { instance } from "industry-instance"
import { include } from "industry-include"

let test = factory()
  .set("instance", instance)
  .set("include", include)
  .base(class {
    constructor() {
      this.include(`${__dirname}`)
    }

    hello({ include: { files: { test } } }) {
      test // import test from `${__dirname}/files/files.test.js`
    }
  })

test().hello()
```
