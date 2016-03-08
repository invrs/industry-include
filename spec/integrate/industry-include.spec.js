import { factory } from "industry"
import { functions } from "industry-functions"
import { instance } from "industry-instance"
import { standard_io } from "industry-standard-io"
import { include } from "../../"

describe("factory_state", () => {
  let test

  function makeTest() {
    return factory()
      .set("functions", functions)
      .set("include", include)
      .set("instance", instance)
      .set("standard_io", standard_io)
      .base(class {
        constructor() {
          this.standardIO()
          this.include(`${__dirname}/../fixture`)
        }

        hello({ include }) { return include }
      })
  }

  it("receives include as parameter", () => {
    test = makeTest()
    expect(test().hello().value.file).toEqual(jasmine.any(Function))
    expect(test().hello().value.file.file2).toEqual(jasmine.any(Function))
    expect(test().hello().value.server).toEqual(jasmine.any(Function))
    expect(test().hello().value.server.express).toEqual(jasmine.any(Function))
  })
})
