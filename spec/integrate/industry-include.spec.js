import { factory } from "industry"
import { factory_instance } from "industry-factory-instance"
import { include } from "../../"

describe("factory_state", () => {
  let test

  function makeTest() {
    return factory()
      .set("factory_instance", factory_instance)
      .set("include", include)
      .base(class {
        constructor() {
          this.include(`${__dirname}/../`)
        }
      })
  }

  beforeEach(() => {
    test = makeTest()
  })

  it("assigns require function based on filename", () => {
    expect(test().integrate["industry-include"].spec)
      .toEqual(jasmine.any(Function))
  })
})
