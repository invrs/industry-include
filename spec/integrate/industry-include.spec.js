import { factory } from "industry"
import { instance } from "industry-instance"
import { include } from "../../"

describe("factory_state", () => {
  let test

  function makeTest() {
    return factory()
      .set("instance", instance)
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
