/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-10-26 09:18:45
 * @LastEditTime: 2021-03-18 13:18:48
 * @FilePath: /server-api/routes/index.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../config/db')
var helper = require('../utils/helper')
const boom = require('boom')
const { CODE_ERROR } = require('../utils/constant')
const jwtAuth = require('../utils/jwt')
const Result = require('../utils/result')
// 接口安全验证必须在接口路由之前
router.use(jwtAuth)
//  扫描路由路径
const scanResult = helper.scanDirModules(__dirname, __filename)
for (const prefix in scanResult) {
  if (scanResult.hasOwnProperty(prefix)) {
    router.use(prefix, scanResult[prefix])
  }
}

/* 仅用于服务器连接和数据库连接测试，不涉及相关功能 */
router.get('/', function (req, res, next) {
  DB.queryDB('select * from  t_user_list', function (error, results, fields) {
    if (error) {
      console.log('数据库连接测试失败，Error', error)
    } else {
      console.log('数据库连接测试成功。')
    }
  })
  res.render('index', { title: 'Express' })
})

/**
 *  集中处理404请求的中间件
 * */
router.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
})
/**
 *  自定义路由异常处理中间件
 *  注意点：
 *  第一，方法的参数不能减少
 *  第二，方法必须放在路由的最后面
 * **/

router.use((err, req, res, next) => {
  console.log(err)
  if (err.name === 'UnauthorizedError') {
    new Result(null, 'token失效', {
      error: err.status,
      errorMsg: err.name
    }).jwtError(res.status(err.status))
  } else {
    const msg = (err && err.message) || '系统错误'
    const statusCode = (err.output && err.output.statusCode) || 500
    const errorMsg =
      (err.output && err.output.payload && err.output.payload.error) ||
      err.message
    new Result(null, msg, {
      error: statusCode,
      errorMsg
    }).fail(res.status(statusCode))
  }
})

module.exports = router
