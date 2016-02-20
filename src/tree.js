import fs from "fs"
import path from "path"

export default class Tree {

  constructor(dir) {
    this.root = path.resolve(dir)
  }

  addToTree(fn, file, tree) {
    let classes = this.pathToClasses(file)

    classes.forEach((item, i) => {
      if (item == "") return
      if (i === classes.length - 1) {
        tree[item] = function(...args) {
          return fn(this, file)(...args)
        }
      }
      else {
        tree[item] = tree[item] || {}
        tree = tree[item]
      }
    })
  }

  // Main entry point
  //
  build(fn, dir = this.root, tree = {}) {
    let files = this.files(dir, fs.readdirSync(dir))

    this.sortFiles(files.files).forEach(file => {
      this.addToTree(fn, file, tree)
    })

    files.dirs.forEach(file => {
      this.build(fn, file, tree)
    })

    return tree
  }

  files(dir, files) {
    return files.reduce(
      (previous, current) => {
        let file = path.join(dir, current)

        if (fs.lstatSync(file).isDirectory()) {
          previous.dirs.push(file)
        }
        else {
          previous.files.push(file)
        }

        return previous
      },
      { dirs: [], files: [] }
    )
  }

  functionify(string) {
    let regex = /^[a-z]|[_\.][a-z]/g
    let index = -1

    return string.replace(regex, match => {
      if ((index += 1) == 0) {
        return match
      }
      else {
        return match.toUpperCase().replace(/_/, "")
      }
    })
  }

  pathToArray(file) {
    file = file
      .replace(`${this.root}/`, "")
      .replace(/\//g, ".")

    file = this.removeExt(file)
    return file.split(".")
  }

  pathToClasses(file) {
    let classes = []
    let paths   = this.pathToArray(file)

    for (let klass of paths) {
      if (classes.indexOf(klass) === -1) {
        classes.push(klass)
      }
    }

    classes[classes.length-1] = this.functionify(
      classes[classes.length-1]
    )

    return classes
  }

  removeExt(file) {
    return file.replace(/\.[^\.]+$/, "")
  }

  sortFiles(files) {
    files = files.filter(file => !file.match(/\.map$/))

    return files.sort((current, next) =>
      this.removeExt(current) > this.removeExt(next)
    )
  }
}
