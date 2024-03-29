/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-04-09 15:05:09
 * @LastEditTime: 2021-04-09 20:33:16
 * @FilePath: /server-api/routes/v1.0/public/analysis.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var fs = require('fs')
var moment = require('moment')
var readline = require('readline')
const Result = require('../../../utils/result')
const { once } = require('events')
// 统计次数分析
router.get('/request/count', function (req, res, next) {
  let current = moment(Date.now()).format('YYYY-MM-DD')
  let logPath = './logs/access-' + current + '.log'
  var resultArr = []
  var resultObj = []

  if (!fs.existsSync(logPath)) {
    console.log('文件不存在')
    new Result('文件不存在', 'error').fail(res)
    return
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
  })
  rl.on('line', (line) => {
    let strArr = line.split('%')
    let obj = {
      PATH: strArr[2],
      METHOD: strArr[1]
    }
    resultArr.push(strArr[2] + '%' + strArr[1])
    resultObj.push(obj)
  }).on('close', () => {
    let newResult = resultArr.reduce(function (prev, next) {
      prev[next] = prev[next] + 1 || 1
      return prev
    }, {})
    let returnResult = []
    let sortableResult = []
    for (key in newResult) {
      sortableResult.push([key, newResult[key]])
    }
    console.log(sortableResult)
    sortableResult = sortableResult.sort(function (a, b) {
      return b[1] - a[1]
    })
    console.log(sortableResult)
    sortableResult.forEach((item) => {
      let keyArr = item[0].split('%')
      returnResult.push({
        PATH: keyArr[0],
        METHOD: keyArr[1],
        COUNT: item[1]
      })
    })
    new Result(returnResult, 'success').success(res)
  })
})
module.exports = router
