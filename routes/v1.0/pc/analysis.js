/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-05-24 14:15:51
 * @LastEditTime: 2021-05-24 14:55:00
 * @FilePath: /server-api/routes/v1.0/pc/analysis.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')

router.get('/sale', function (req, res, next) {
  DB.queryDB(
    `select round(sum(case when order_type = 1 then order_final_price else null end),2) as 'usual',
    round(sum(case when order_type = 2 then order_final_price else null end),2) as 'business',
   round( sum(case when order_type = 3 then order_final_price else null end),2) as 'box',
   round(sum(case when order_status != 2 and order_status != 0 then order_final_price else  null end),2) as 'total'
    from t_order_list;`,
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

module.exports = router
