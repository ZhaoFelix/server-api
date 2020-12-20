/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-20 21:00:03
 * @LastEditTime: 2020-12-20 21:04:45
 * @FilePath: /server-api/routes/v1.0/Dmobile/feedback.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')

router.post('/', function (req, res, next) {
  let { userId, feedback } = req.body
  DB.queryDB(
    'insert into t_feedback_list (user_id,feedback_content,feedback_created_time) value(?,?,NOW())',
    [userId, feedback],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '反馈失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '反馈成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

module.exports = router
