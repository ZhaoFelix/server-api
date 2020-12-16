/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-17 13:15:32
 * @LastEditTime: 2020-12-16 15:57:30
 * @FilePath: /server-api/routes/v1.0/pc/order.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')

// 查询所有的订单
router.get('/query/all', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  DB.queryDB(
    'SELECT order_id,order_number,order_price,order_final_price,user_reserve_time,order_size,order_user_type,user_phone,user_adress,wechat_nickname,driver_name,driver_phone,user_place_order_img,order_created_time,order_status from v_order_list order by order_created_time LIMIT ? OFFSET ?',
    [limit, offset],
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

// TODO:删除订单

// TODO:订单允许二次预约下单

// TODO:查询所有进行中的订单，已支付但未派车，已支付且已派车

// TODO:根据订单号查询订单

router.get('/query/queryByOrderNumber', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let order_number = query.order_number
  DB.queryDB(
    'SELECT order_id,order_number,order_price,order_final_price,user_reserve_time,order_size,order_user_type,user_phone,user_adress,wechat_nickname,driver_name,driver_phone,user_place_order_img,order_created_time,order_status from v_order_list  where order_number = ? order by order_created_time ',
    [order_number],
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
          let responseJson = {
            code: 20002,
            message: error,
            data: '调整失败'
          }
          res.send(responseJson)
        } else {
          let responseJson = {
            code: 20000,
            message: '调整成功',
            data: result
          }
          res.send(responseJson)
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
          let responseJson = {
            code: 20002,
            message: error,
            data: '设置失败'
          }
          res.send(responseJson)
        } else {
          let responseJson = {
            code: 20000,
            message: '设置成功',
            data: result
          }
          res.send(responseJson)
        }
      }
    )
  }
})
module.exports = router
