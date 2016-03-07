# IndustryInclude [![Build Status](https://travis-ci.org/invrs/industry-include.svg?branch=master)](https://travis-ci.org/invrs/industry-include)

Adds an include function to the [Industry](https://github.com/invrs/industry) factory class that traverses a directory of dependencies and adds them as semantic objects.

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
  })

test().files.test() // require(`${__dirname}/files/files.test.js`)
```
