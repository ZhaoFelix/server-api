/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-10 13:26:52
 * @LastEditTime: 2021-01-11 15:27:12
 * @FilePath: /server-api/routes/v1.0/pc/ongoing.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')

router.get('/driver', function (req, res, next) {
  // 仅显示当天订单
  DB.queryDB(
    "select  * from v_assign_order where date_format(user_reserve_time,'%Y-%m-%d') = date_format(NOW(),'%Y-%m-%d') order by  order_created_time asc",
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '查询订单失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '查询成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

module.exports = router
