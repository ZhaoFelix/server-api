/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-09 14:28:16
 * @LastEditTime: 2021-01-10 00:44:33
 * @FilePath: /server-api/routes/v1.0/mobile/order.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var DB = require('../../../config/db')
var router = express.Router()
var url = require('url')
// 根据用户ID查询订单
router.get('/query', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let userId = req.query.userId
  DB.queryDB(
    'select  * from v_wechat_order where user_id=? order by order_created_time desc',
    userId,
    function (error, result, next) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '查询失败',
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
        let responseJson = {
          code: 20002,
          message: '查询失败',
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

// 根据用户ID查询小区
router.get('/query/plot', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let wechat_id = req.query.wechat_id
  DB.queryDB(
    'select  estate_plot as text,estate_id as id from t_estate_list where  wechat_id=?',
    wechat_id,
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '查询失败',
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
