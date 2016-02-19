import { factory } from "industry"
import { factory_state } from "../../"

describe("factory_state", () => {
  let test, id

  function makeTest(id) {
    return factory()
      .set("factory_state", factory_state)
      .base(class {
        constructor() {
          this.id = id
          this.rand = Math.random()
        }
      })
  }

  beforeEach(() => {
    id = Math.random()
    test = makeTest(id)
  })
})
