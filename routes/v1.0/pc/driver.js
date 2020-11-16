var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')

// 查询所有司机的信息
router.get("/query/all",function(req,res,next){
    // 前端传值
    let parseObj = url.parse(req.url,true)
    let query = parseObj.query
    let limit = parseInt(query.limit)
    let offset = parseInt(query.offset)
    DB.queryDB("select  * from t_driver_list  limit ? offset ?",[
        limit,
        offset
    ], function (error, result, fields) {
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
      })
})

// 查询司机当月排班情况
router.get('/query/schedule',function(req,res,next){
  let parseObj = url.parse(req.url,true)
  let query = parseObj.query
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  let date = new Date()
  let current_month = date.getMonth() + 1
  DB.queryDB('select  * from t_driver_schedule where schedule_month = ? limit ? offset ?',[current_month,limit,offset],function(error,result,fields){
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
  })
})
module.exports = router