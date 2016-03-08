import Tree from "./tree"

let cache = {}

export let include = Class =>
  class extends Class {
    include(...dirs) {
      let tree
      
      this._include = this._include || {}

      for (let dir of dirs) {
        if (cache[dir]) {
          tree = cache[dir]
        } else {
          tree = new Tree(dir).build((self, file) =>
            (...args) => require(file).default.bind(self)(...args)
          )
        }
        
        for (let key in tree) {
          this._include[key] = tree[key]
        }
      }

      let ignore = [ "functions", "include", "standardIO", "state", "stateful" ]

      for (let [ name, fn ] of this.functions().entries()) {
        if (ignore.indexOf(name) == -1) {
          this[name] = (...args) =>
            fn.bind(this)({ ...args, include: this._include || {} })
        }
      }
    }
  }
