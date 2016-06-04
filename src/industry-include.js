import Tree from "./tree"

function bindObject({ instance, tree }) {
  let keys = []
  for (let key in tree) {
    if (instance[key]) {
      bindObject({ instance: instance[key], tree: tree[key] })
    } else {
      instance[key] = tree[key]
    }
    keys.push(key)
  }
}

export let include = Class =>
  class extends Class {
    static beforeFactoryOnce() {
      this.industry({
        ignore: { instance: [ "include" ] },
        included: []
      })
      super.beforeFactoryOnce()
    }

    include(...dirs) {
      let bind = true
      let files
      let tree = {}
      let keys = []
      let options = {}

      if (typeof dirs[dirs.length - 1] == "object") {
        options = dirs.pop()
        files = options.files
        bind = options.bind != false
      }

      for (let dir of dirs) {
        let new_tree = new Tree(dir).build(files, (self, file, value) => {
          value = value || require(file).default
          return (...args) => {
            return value.bind(self)(...args)
          }
        })

        for (let key in new_tree) {
          tree[key] = new_tree[key]
        }
      }

      if (bind) {
        let keys = bindObject({ instance: this, tree })
        this.Class.industry({
          ignore: { instance: keys },
          included: keys
        })
      }

      return tree
    }
  }
