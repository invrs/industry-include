import path from "path"
import Tree from "../../lib/tree"

describe("Tree", () => {
  describe("build", () => {

    it("creates a dependency tree of functions", (done) => {
      let index_path = path.join(__filename, "../tree.spec.js")
      let tree       = new Tree(`${__dirname}/../../spec`)

      tree = tree.build(
        undefined,
        (self, file) => () => {
          expect(file).toEqual(index_path)
          done()
        }
      )

      tree.unit.tree.spec()
    })

    it("works with files and directories of the same name", (done) => {
      let file_path = path.join(__filename, "../../../spec/fixture/file.js")
      let tree      = new Tree(`${__dirname}/../../spec/fixture`)

      tree = tree.build(
        undefined,
        (self, file) => () => {
          expect(file).toEqual(file_path)
          done()
        }
      )
      
      expect(tree.file.file2).toEqual(jasmine.any(Function))
      tree.file()
    })

    it("maps the fixture properly", () => {
      let tree = new Tree(`${__dirname}/../../spec/fixture`)
      tree = tree.build(undefined, (self, file) => () => {})
      
      expect(tree.file).toEqual(jasmine.any(Function))
      expect(tree.file.file2).toEqual(jasmine.any(Function))
      expect(tree.server).toEqual(jasmine.any(Function))
      expect(tree.server.express).toEqual(jasmine.any(Function))
    })
  })
})
