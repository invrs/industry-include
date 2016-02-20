import Tree from "./tree"

export let include = Class =>
  class extends Class {
    include(dir) {
      let tree = new Tree(dir).build((self, file) =>
        (...args) => require(file).default.bind(self)(...args)
      )
      
      for(let key in tree) {
        this[key] = tree[key]
      }
    }
  }
