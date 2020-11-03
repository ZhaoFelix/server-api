const fs = require('fs')
const path =  require('path')
const { route } = require('../routes')

function transform(filename) {
    return filename.slice(0,filename.lastIndexOf('.'))
    .replace(/\\/g,'/')
    .replace('/index','/')
    .replace(/^[/]*/,'/')
    .replace(/[/]*$/,'')
}

exports.scanDirModules = function scanDirModules(rootDir,excludeFile){
    console.log('路由扫描')
    if (!excludeFile) {
        excludeFile = path.join(rootDir,'index.js')
    }
    // 模块集合
    const modules = {}
    let filesnames = fs.readdirSync(rootDir)
    while (filesnames.length) {
        const relativeFilePath = filesnames.shift()
        const absFilePath = path.join(rootDir,relativeFilePath)
        if (absFilePath == excludeFile) {
            continue
        }
        if (fs.statSync(absFilePath).isDirectory()){
            const subFiles = fs.readdirSync(absFilePath).map( v => path.join(absFilePath.replace(rootDir,""),v))
            filesnames = filesnames.concat(subFiles)
        } else {
            const prefix = transform(relativeFilePath)
            modules[prefix] = require(absFilePath)
        }
    }
    return  modules
}