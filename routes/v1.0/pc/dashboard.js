/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-18 14:43:30
 * @LastEditTime: 2021-03-30 11:00:25
 * @FilePath: /server-api/routes/v1.0/pc/dashboard.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var Result = require('../../../utils/result')
var url = require('url')
router.get('/basic', function (req, res, next) {
  DB.queryDB(
    'select * from v_analystic_basic',
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询订单失败').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 查询最近七天的订单量
router.get('/week', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let type = query.type

  let sql =
    type == 'order'
      ? "select DATE_FORMAT(user_reserve_time,'%Y-%m-%d') days,count(order_id) count from t_order_list where DATE_SUB(curdate(),INTERVAL 7 DAY) <= date(user_reserve_time) group by days"
      : "select DATE_FORMAT(wechat_created_time,'%Y-%m-%d') days,count(user_id) count from t_user_list  where DATE_SUB(curdate(),INTERVAL 7 DAY) <= date(wechat_created_time) group by days"
  DB.queryDB(sql, function (error, result, fields) {
    if (error) {
      new Result(error, '查询订单失败').fail(res)
    } else {
      new Result(result, 'success').success(res)
    }
  })
})

module.exports = router
