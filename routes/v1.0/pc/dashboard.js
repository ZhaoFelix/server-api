/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-18 14:43:30
 * @LastEditTime: 2020-12-18 15:08:08
 * @FilePath: /server-api/routes/v1.0/pc/dashboard.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')

router.get('/basic', function (req, res, next) {
  DB.queryDB(
    'select * from v_analystic_basic',
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: error,
          data: '查询订单失败'
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: 'sucess',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

// 查询最近七天的订单量
router.get('/week', function (req, res, next) {
  DB.queryDB(
    "select DATE_FORMAT(user_reserve_time,'%Y-%m-%d') days,count(order_id) count from t_order_list where DATE_SUB(curdate(),INTERVAL 7 DAY) <= date(user_reserve_time) group by days",
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: error,
          data: '查询订单失败'
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: 'sucess',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

module.exports = router
