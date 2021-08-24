/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-09 14:28:16
 * @LastEditTime: 2021-08-24 14:40:53
 * @FilePath: /server-api/routes/v1.0/mobile/order.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var DB = require('../../../config/db')
var router = express.Router()
var url = require('url')
const Result = require('../../../utils/result')
var util = require('../../../utils/pay')
var common = require('../../../utils/common')
// 根据用户ID查询订单
router.get('/query', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let userId = req.query.userId
  let type = req.query.type
  let sqlStr =
    type == '1'
      ? ' and order_status >=3 and order_status < 6'
      : type == '2'
      ? ' and order_status = 6'
      : ''
  DB.queryDB(
    `select  *, if(substring_index(user_reserve_time, ' ',-1) = '08:00:00', concat(substring_index(user_reserve_time, ' ',1), ' 上午' ),concat(substring_index(user_reserve_time, ' ',1), ' 下午' ) ) as reserve_time,if(order_type = 2, round(order_price, 2), round(order_price * 0.8, 2)) as discount_price from v_wechat_order where user_id=? ` +
      sqlStr +
      ` order by order_created_time desc limit 0,60`,
    userId,
    function (error, result, next) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 根据车辆ID和司机ID查询信息
router.get('/query/info', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let driver_id = req.query.driverId
  let car_id = req.query.carId
  DB.queryDB(
    'select  a.car_number,b.driver_name,b.driver_phone from  t_car_list as a, t_driver_list as b where a.car_id = ? and b.driver_id = ?',
    [car_id, driver_id],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 根据用户ID查询小区
router.get('/query/plot', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let wechat_id = req.query.wechat_id
  DB.queryDB(
    'select  estate_plot as text,estate_id as id from t_estate_list where  wechat_id=? and estate_is_deleted = 0',
    wechat_id,
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 二次清运订单生成
router.post('/second', function (req, res, next) {
  let order_number = util.getTradeId('mp')
  let { imagesList, orderNote, selectTime, orderId } = req.body
  DB.queryDB(
    `insert into t_order_list (user_id,order_user_type,user_phone,user_address,estate_id,order_user_name,order_is_assign, user_reserve_time,order_number,user_note,father_order_id,order_price,order_final_price,order_status,order_size,order_type,order_pay_time,order_created_time)
    select user_id,order_user_type,user_phone,user_address,estate_id,order_user_name,order_is_assign,?,?,?,?,0,0,1,0,11,now(),now() from t_order_list where order_id=? and order_is_deleted = 0;
    `,
    [
      common.timeFormatter(selectTime),
      order_number,
      orderNote,
      orderId,
      orderId
    ],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
        let order_id = result.insertId
        //  订单创建成功后将用户提交的图片链接存储到t_order_info_list表
        DB.queryDB(
          'insert  into t_order_info_list (user_place_order_img,user_place_order_time,order_id,created_time) values (?,Now(),?,NOW())',
          [JSON.stringify(imagesList), order_id],
          function (error, resu, fields) {
            if (error) {
              // TODO:将订单更新信息写入文件
              console.log('新建订单信息记录失败，error:' + error)
            } else {
              console.log('新建订单信息记录成功，记录ID为：' + resu.insertId)
            }
          }
        )
      }
    }
  )
})
module.exports = router
