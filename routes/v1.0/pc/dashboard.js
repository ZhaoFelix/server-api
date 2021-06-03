/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-18 14:43:30
 * @LastEditTime: 2021-06-03 13:43:17
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
  let gapDay = query.time == undefined ? 7 : query.time
  let sql =
    type == 'order'
      ? "select DATE_FORMAT(order_created_time,'%Y-%m-%d') days,count(order_id) count from t_order_list where order_status != 2 and order_status != 0 and DATE_SUB(curdate(),INTERVAL ? DAY) <= date(order_created_time) group by days"
      : "select DATE_FORMAT(wechat_created_time,'%Y-%m-%d') days,count(user_id) count from t_user_list  where DATE_SUB(curdate(),INTERVAL ? DAY) <= date(wechat_created_time) group by days"
  DB.queryDB(sql, gapDay, function (error, result, fields) {
    if (error) {
      new Result(error, '查询订单失败').fail(res)
    } else {
      new Result(result, 'success').success(res)
    }
  })
})
// 销售额统计
router.get('/sale', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let timeGap = query.timeGap
  let sql = `select DATE_FORMAT(order_created_time,'%Y-%m-%d') days,round(sum(order_final_price),2) count, round(sum(order_price),2) as total from t_order_list where order_status != 2 and order_status !=0 and DATE_SUB(curdate(),INTERVAL ? DAY) <= date(order_created_time) group by days;`
  DB.queryDB(
    sql,
    timeGap == undefined ? 7 : timeGap,
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询订单失败').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})
// 查询已认证和未认证的司机(物业)比例
router.get('/driver/auth', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let type = query.type
  let sql =
    type == 'driver'
      ? 'select  A.total , B.auth_count from (select  count(driver_id) as total from t_driver_list where  driver_is_deleted =0 ) as A, (select  count(driver_id) as auth_count from t_driver_list where driver_is_deleted = 0 and driver_is_auth=1) as B;'
      : 'select  A.total , B.auth_count from (select  count(estate_id) as total from t_estate_list where estate_is_deleted = 0) as A, (select  count(estate_id) as auth_count from t_estate_list where estate_is_deleted = 0 and estate_is_auth=1) as B;'
  DB.queryDB(sql, function (error, result, fields) {
    if (error) {
      new Result(error, '查询失败').fail(res)
    } else {
      new Result(result, 'success').success(res)
    }
  })
})

router.get('/order/ratio', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let type = query.type
  let sql =
    type == undefined
      ? `select count(distinct case when order_type = 1 then order_id else null end) as '居民装修',
  count(distinct case when order_type = 2 then order_id else null end) as '商业装修',
  count(distinct case when order_type = 3 then order_id else null end) as '垃圾箱清运',
  count(distinct case when order_type = 11 then order_id else null end) as '二次清运'
  from t_order_list where order_status != 2;`
      : `select count(distinct case when order_type = 1 then order_id else null end) as '居民装修',
      count(distinct case when order_type = 2 then order_id else null end) as '商业装修',
      count(distinct case when order_type = 3 then order_id else null end) as '垃圾箱清运',
      count(distinct case when order_type = 11 then order_id else null end) as '二次清运'
      from t_order_list where order_status != 2 and  DATE_FORMAT(order_created_time,'%Y-%m-%d') = DATE_FORMAT(now(),'%Y-%m-%d');`
  DB.queryDB(sql, function (error, result, fields) {
    if (error) {
      new Result(error, '查询失败').fail(res)
    } else {
      new Result(result, 'success').success(res)
    }
  })
})

router.get('/status/ratio', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let type = query.type
  let sql =
    type == undefined
      ? `select count(distinct case when order_status = 2 then order_id else null end) as '被取消订单',
  count(distinct case when order_status = 6 then order_id else null end) as '已完成订单',
  count(distinct case when order_status != 2 and order_status != 6 and order_status != 0 then order_id else null end) as '进行中订单',count(distinct case when order_status = 0 then order_id else null end) as '待支付订单'
  from t_order_list;`
      : `select count(distinct case when order_status = 2 then order_id else null end) as '被取消订单',
      count(distinct case when order_status = 6 then order_id else null end) as '已完成订单',
      count(distinct case when order_status != 2 and order_status != 6 and order_status != 0 then order_id else null end) as '进行中订单',count(distinct case when order_status = 0 then order_id else null end) as '待支付订单'
      from t_order_list where DATE_FORMAT(order_created_time,'%Y-%m-%d') = DATE_FORMAT(now(),'%Y-%m-%d');`
  DB.queryDB(sql, function (error, result, fields) {
    if (error) {
      new Result(error, '查询失败').fail(res)
    } else {
      new Result(result, 'success').success(res)
    }
  })
})

module.exports = router
