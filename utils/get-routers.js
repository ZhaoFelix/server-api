const fs = require('fs')
var exp = {}
let files = fs.readdirSync(__dirname + '/../routes')

let reg = /([\S]+)\.js$/i

files.forEach(function (val) {
  let matchs = reg.exec(val) // 正则匹配
  // TODO: 当存在多层文件夹
  if (matchs == null) {
    let files = fs.readdirSync(__dirname + '/../routes/' + val)
    console.log(files)
    files.forEach(function (va) {
      let matchs = reg.exec(va)
      if (matchs && matchs.index >= 0) {
        exp[matchs[1]] = require('../routes/' + val + '/' + va)
      }
    })
  } else {
    if (matchs && matchs.index >= 0) {
      exp[matchs[1]] = require('../routes/' + val)
    }
  }
})
module.exports = exp
