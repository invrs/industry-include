import Tree from "./tree"

let cache = {}

export let include = Class =>
  class extends Class {
    static beforeFactoryOnce() {
      this.industry({
        ignore: {
          instance: [ "include" ]
        }
      })
    }

    include(...dirs) {
      let tree, files, options = {}

      if (typeof dirs[dirs.length - 1] == "object") {
        options = dirs.pop()
        files = options.files
      }
      
      this._include = this._include || {}

      for (let dir of dirs) {
        if (cache[dir]) {
          tree = cache[dir]
        } else {
          tree = new Tree(dir).build(files, (self, file, value) => {
            value = value || require(file).default
            return (...args) => {
              return value.bind(self)(...args)
            }
          })
        }
        
        for (let key in tree) {
          this._include[key] = tree[key]
        }
      }

      let ignore = [ "functions", "include", "standardIO", "state", "stateful" ]

      for (let [ name, fn ] of this.functions().entries()) {
        if (ignore.indexOf(name) == -1) {
          this[name] = (...args) =>
            fn.bind(this)(...args, { include: this._include || {} })
        }
      }
    }
  }
