import Tree from "./tree"

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
      let files, tree
      let keys = []
      let options = {}

      if (typeof dirs[dirs.length - 1] == "object") {
        options = dirs.pop()
        files = options.files
      }

      for (let dir of dirs) {
        tree = new Tree(dir).build(files, (self, file, value) => {
          value = value || require(file).default
          return (...args) => {
            return value.bind(self)(...args)
          }
        })
        
        for (let key in tree) {
          this[key] = tree[key]
          keys.push(key)
        }
      }

      this.Class.industry({ ignore: { instance: keys } })
      let ignore = this.Class.industry().ignore.instance

      for (let name in this.functions()) {
        if (ignore.indexOf(name) == -1) {
          let fn = this[name]
          this[name] = (...args) =>
            fn.bind(this)(...args, { include: tree || {} })
        }
      }
    }
  }
