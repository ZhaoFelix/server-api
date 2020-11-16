var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
const { resolve } = require('path')

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

// 查询当天的值班司机信息
router.get('/query/current',function(req,res,next){
  let date = new Date()
  let current_month = date.getMonth() + 1
  let current_date = date.getDate()
  return new Promise((resolve,reject) => {
    DB.queryDB('select  * from t_driver_schedule where schedule_month = ?',[current_month],function(error,result,fields){
      if (error) {
        reject('查询信息失败，error:'+error)
      } else {
       resolve(result)
      }
    })
  }).then((data) => {
    let returnResult = []
    for (var i=0;i<data.length;i++){
      let obj = data[i]
      let schedule = obj.driver_schedule.split('.')
      console.log(current_date.toString())
      if(schedule.indexOf(current_date.toString()) == -1) {
        returnResult.push(obj)
      }
    }
    let responseJson = {
      code: 20000,
      message: 'success',
      data: returnResult
    }
    res.send(responseJson)
  })
  .catch((error) => {
    let responseJson = {
      code: 20002,
      message: 'error',
      data: error
    }
    res.send(responseJson)
  })
  
})
module.exports = router