/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-15 14:31:58
 * @LastEditTime: 2020-12-15 14:45:29
 * @FilePath: /server-api/routes/v1.0/Dmobile/user.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var DB = require('../../../config/db')
var router = express.Router()
var url = require('url')
router.get('/info', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let userId = req.query.userId
  DB.queryDB(
    'select  driver_name,driver_phone,driver_card_id,router_note,driver_is_auth from t_driver_list where wechat_id = ?',
    userId,
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
