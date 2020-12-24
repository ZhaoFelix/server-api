/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-12 10:04:39
 * @LastEditTime: 2020-12-24 08:34:15
 * @FilePath: /server-api/routes/v1.0/pc/estate.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')

// 查询所有物业经理人的信息
router.get('/query/all', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  console.log(parseObj)
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  DB.queryDB(
    'select  * from t_estate_list  where estate_is_deleted = 0 limit ? offset ? ',
    [limit, offset],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(responseJson)
      } else {
        DB.queryDB(
          'select count(estate_id) as total from t_estate_list where estate_is_deleted = 0',
          function (error, resu, fields) {
            if (error) {
              let responseJson = {
                code: 20002,
                message: '查询记录条数失败',
                data: error
              }
              res.send(responseJson)
            } else {
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
// 根据手机号查询经理人信息
router.get('/query/queryByKeyword', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let keyword = query.keyword
  DB.queryDB(
    "select  * from t_estate_list  where estate_is_deleted = 0 and estate_phone like '%" +
      keyword +
      "%'",
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
