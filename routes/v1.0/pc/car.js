/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-13 14:34:59
 * @LastEditTime: 2021-03-18 08:54:04
 * @FilePath: /server-api/routes/v1.0/pc/car.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')
// 分页查询司机的信息
router.get('/query/all', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  console.log(parseObj)
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  DB.queryDB(
    'select  * from  t_car_list  limit ? offset ?',
    [limit, offset],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        // 查询所有记录的条数
        DB.queryDB(
          'select  count(car_id) as total from  t_car_list where car_is_deleted = 0',
          function (error, resu, fields) {
            if (error) {
              new Result(error, 'e查询记录总条数失败').fail(res)
            } else {
              // new Result(error, 'sucess').sucess(res)
              console.log(result)
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
      }
    }
  )
})
// 根据车牌号查询车辆信息
router.get('/query/queryByKeyword', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let keyword = query.keyword
  DB.queryDB(
    "select  * from  t_car_list where car_number like '%" + keyword + "%'",
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: 'success',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})
module.exports = router
