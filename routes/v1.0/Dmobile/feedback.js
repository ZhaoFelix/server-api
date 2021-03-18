/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-20 21:00:03
 * @LastEditTime: 2021-03-18 08:51:15
 * @FilePath: /server-api/routes/v1.0/Dmobile/feedback.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var Result = require('../../../utils/result')
router.post('/', function (req, res, next) {
  let { userId, feedback } = req.body
  DB.queryDB(
    'insert into t_feedback_list (user_id,feedback_content,feedback_created_time) value(?,?,NOW())',
    [userId, feedback],
    function (error, result, fields) {
      if (error) {
        new Result(error, '反馈失败').fail(res)
      } else {
        new Result(result, '反馈成功').success(res)
      }
    }
  )
})

module.exports = router
