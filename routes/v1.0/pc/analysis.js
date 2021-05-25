/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-05-24 14:15:51
 * @LastEditTime: 2021-05-25 13:38:24
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
    round(sum(case when order_type = 1 then order_price else null end),2) as 'usual_total',
 round(sum(case when order_type = 2 then order_final_price else null end),2) as 'business',
    round(sum(case when order_type = 2 then order_price else null end),2) as 'business_total',
round( sum(case when order_type = 3 then order_final_price else null end),2) as 'box',
     round( sum(case when order_type = 3 then order_price else null end),2) as 'box_total',
round(sum(case when order_status != 2 and order_status != 0 then order_price else  null end),2) as 'actual_total',
    round(sum(case when order_status != 2 and order_status != 0 then order_final_price else  null end),2) as 'total'
 from t_order_list where order_status != 0 and order_status != 2;`,
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 根据时间段查询
router.get('/time/sale', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let startDate = query.startDate
  let endDate = query.endDate
  DB.queryDB(
    `select DATE_FORMAT(order_created_time,'%Y-%m-%d') days,round(sum(order_final_price),2) count, round(sum(order_price),2) as total from t_order_list where order_status != 2 and order_status != 0 and DATE_FORMAT(order_created_time,'%Y-%m-%d') >= DATE_FORMAT(?,'%Y-%m-%d') and DATE_FORMAT(order_created_time,'%Y-%m-%d') <= DATE_FORMAT(?,'%Y-%m-%d') group by days;`,
    [startDate, endDate],
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
