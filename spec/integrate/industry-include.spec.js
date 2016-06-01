import { factory } from "industry"
import { functions } from "industry-functions"
import { instance } from "industry-instance"
import { standard_io } from "industry-standard-io"
import { include } from "../../"

describe("factory_state", () => {
  let test

  function makeTest(options) {
    return factory()
      .set("functions", functions)
      .set("include", include)
      .set("instance", instance)
      .set("standard_io", standard_io)
      .base(class {
        init() {
          if (options) {
            this.include(`${__dirname}/../fixture`, options)
          } else {
            this.include(`${__dirname}/../fixture`)
          }
        }

        hello({ include }) { return include }
      })
  }

  it("binds includes to instance", () => {
    test = makeTest()
    expect(test().file).toEqual(jasmine.any(Function))
    expect(test().file.file2).toEqual(jasmine.any(Function))
    expect(test().server).toEqual(jasmine.any(Function))
    expect(test().server.express).toEqual(jasmine.any(Function))
  })

  it("returns the tree", () => {
    test = makeTest()
    let tree = test().include(`${__dirname}/../fixture`)
    expect(tree.file).toEqual(jasmine.any(Function))
    expect(tree.file.file2).toEqual(jasmine.any(Function))
    expect(tree.server).toEqual(jasmine.any(Function))
    expect(tree.server.express).toEqual(jasmine.any(Function))
  })

  it("allows explicit passing of directory structure", () => {
    let fixture = `${__dirname}/../fixture`
    let files = {
      files: [ `${fixture}/file.js`, `${fixture}/server.express.js`, `${fixture}/server.js` ],
      dirs: {
        [`${fixture}/file`]: {
          files: [ `${fixture}/file/file2.js` ],
          dirs: {}
        }
      },
      values: [ () => "a", () => "b", () => "c" ]
    }
    test = makeTest({ files })
    expect(test().file()).toEqual("a")
    expect(test().file.file2).toEqual(jasmine.any(Function))
    expect(test().server.express()).toEqual("b")
    expect(test().server()).toEqual("c")
  })
})
