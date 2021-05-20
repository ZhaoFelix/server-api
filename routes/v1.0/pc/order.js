/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-17 13:15:32
 * @LastEditTime: 2021-05-20 10:46:32
 * @FilePath: /server-api/routes/v1.0/pc/order.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')

// 查询所有的订单
router.get('/query/all', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  DB.queryDB(
    'SELECT order_id,order_number,order_price,order_type,order_user_name,order_final_price,second_pay_price,user_reserve_time,order_size,order_user_type,user_phone,user_address,wechat_nickname,driver_name,driver_phone,driver_complete_time,order_created_time,order_status,estate_name,estate_plot from v_order_list order by order_created_time desc LIMIT ? OFFSET ?',
    [limit, offset],
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询订单失败').fail(res)
      } else {
        DB.queryDB(
          'select count(order_id) as total from t_order_list where order_status != 2',
          function (error, resu, fields) {
            if (error) {
              new Result(error, '查询记录条数失败').fail(res)
            } else {
              //  TODO:待修改
              let responseJson = {
                code: 20000,
                message: 'success',
                total: resu[0].total,
                data: result
              }
              res.send(responseJson)
            }
          }
        )
        // new Result(result, 'success').success(res)
      }
    }
  )
})

// 查询订单详情
router.get('/query/detail', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let order_number = query.order_number
  // 仅显示当天订单
  DB.queryDB(
    'select  * from v_assign_order where  order_number = ?',
    [order_number],
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询订单失败').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 根据关键字查询订单信息
router.get('/query/queryByKeyword', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let keyword = query.keyword
  console.log(keyword)
  DB.queryDB(
    "SELECT order_id,order_number,order_price,order_type,order_user_name,order_final_price,second_pay_price,user_reserve_time,order_size,order_user_type,user_phone,user_address,wechat_nickname,driver_name,driver_phone,driver_complete_time,order_created_time,order_status,estate_name,estate_plot from v_order_list where concat(estate_name,estate_plot,order_number,driver_name) like '%" +
      keyword +
      "%'",
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})
// 根据时间段查询数据
router.get('/query/queryTime', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query

  DB.queryDB(
    "SELECT order_id,order_number,order_price,order_type,order_user_name,order_final_price,second_pay_price,user_reserve_time,order_size,order_user_type,user_phone,user_address,wechat_nickname,driver_name,driver_phone,driver_complete_time,order_created_time,order_status,estate_name,estate_plot from v_order_list where date_format(order_created_time,'%Y-%m-%d') >= date_format(?,'%Y-%m-%d') and date_format(order_created_time,'%Y-%m-%d') <= date_format(?,'%Y-%m-%d')",
    [query.startDate, query.endDate],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 查询异常订单
router.get('/query/error', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  DB.queryDB(
    `SELECT order_id,order_number,order_price,order_type,order_user_name,order_final_price,second_pay_price,user_reserve_time,order_size,order_user_type,user_phone,user_address,wechat_nickname,driver_name,driver_phone,driver_complete_time,order_created_time,order_status,estate_name,estate_plot,'七折订单' as order_note from v_order_list where round(order_final_price,2) != round ((order_price * 0.8),2) and order_type = 1;`,
    [query.startDate, query.endDate],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

router.get('/query/queryByOrderNumber', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let order_number = query.order_number
  DB.queryDB(
    'SELECT order_id,order_number,order_price,order_final_price,user_reserve_time,order_size,order_user_type,user_phone,user_adress,wechat_nickname,driver_name,driver_phone,user_place_order_img,order_created_time,order_status from v_order_list  where order_number = ? order by order_created_time ',
    [order_number],
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询订单失败').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 调整价格
router.post('/assignprice', function (req, res, next) {
  let { orderId, orderType, assignPrice } = req.body
  // 商业
  if (orderType == 1) {
    DB.queryDB(
      'update  t_order_list set order_price = ? where  order_id = ? and order_price is null and order_type = ?',
      [assignPrice, orderId, orderType],
      function (error, result, fields) {
        if (error) {
          new Result(error, '调整失败').fail(res)
        } else {
          new Result(result, '调整成功').success(res)
        }
      }
    )
  }
  // 普通
  else {
    DB.queryDB(
      'update  t_order_list set order_gap_price = ?,order_status = 7 where  order_id = ? and order_gap_price = 0  and order_type = ? and order_status = 4 ',
      [assignPrice, orderId, orderType],
      function (error, result, fields) {
        if (error) {
          new Result(error, '设置失败').fail(res)
        } else {
          new Result(result, '设置成功').success(res)
        }
      }
    )
  }
})

module.exports = router
