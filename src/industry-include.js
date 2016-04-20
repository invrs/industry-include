import Tree from "./tree"

let cache = {}

export let include = Class =>
  class extends Class {
    static beforeFactoryOnce() {
      this.industry({
        ignore: {
          args: [ "include" ],
          instance: [ "include" ]
        }
      })
      super.beforeFactoryOnce()
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

      let ignore = this.Class.industry().ignore.instance

      for (let name in this.functions()) {
        if (ignore.indexOf(name) == -1) {
          let fn = this[name]
          this[name] = (...args) =>
            fn.bind(this)(...args, { include: this._include || {} })
        }
      }
    }
  }
