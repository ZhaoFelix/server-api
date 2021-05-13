/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-10 13:26:52
 * @LastEditTime: 2021-05-13 17:22:17
 * @FilePath: /server-api/routes/v1.0/pc/ongoing.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var Result = require('../../../utils/result')
router.get('/driver', function (req, res, next) {
  // 仅显示当天订单
  DB.queryDB(
    'select  * from v_assign_order    where order_status != 6  order by  order_created_time asc',
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询订单失败').fail(res)
      } else {
        new Result(result, '查询成功').success(res)
      }
    }
  )
})

module.exports = router
