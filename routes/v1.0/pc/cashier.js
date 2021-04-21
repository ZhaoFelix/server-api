/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-04-21 09:06:42
 * @LastEditTime: 2021-04-21 10:24:31
 * @FilePath: /server-api/routes/v1.0/pc/cashier.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')
var common = require('../../../utils/common')
// 生成验证码
router.get('/code/generate', function (req, res, next) {
  // 生成长度为4的随机验证码
  let verifyCode = common.getRandomStr(4)
  DB.queryDB(
    'insert into t_cashier_code (`cashier_name`,`cashier_wechat_id`,`cashier_code`,`expired_time`) value (?,?,?,adddate(now(), interval  10 day ))',
    ['收费员', 0, verifyCode],
    function (error, result, fields) {
      if (error) {
        new Result(error, '生成验证码失败').error(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})
// 查询验证码列表
router.get('/code/query/all', function (req, res, next) {
  DB.queryDB(
    'select  * from t_cashier_code where  expired_time > now()',
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询失败').error(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

router.get('/code/query/latest', function (req, res, next) {
  DB.queryDB(
    'select  cashier_code from t_cashier_code where  expired_time > now() limit 0,1 ',
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询失败').error(res)
      } else {
        // TODO: 如果验证码已过期
        new Result(result[0], 'success').success(res)
      }
    }
  )
})
module.exports = router
