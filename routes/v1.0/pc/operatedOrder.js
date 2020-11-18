/**
 * 订单处理
 * **/

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
const { type } = require('os')

// TODO:根据线路类型查询今日值班的司机
router.get('/driver/query',function(req,res,next){
    let date = new Date()
    let current_month = date.getMonth() + 1
    let current_date = date.getDate()
    let parseObj = url.parse(req.url,true)
    let query = parseObj.query
    let router_type = parseInt(query.type);
    return new Promise((resolve,reject) => {
        if (router_type == 4) {
            DB.queryDB('SELECT driver_name,car_router_type,router_note,driver_id,driver_is_substitutes from t_driver_list where car_router_type = ? and driver_id not in (SELECT driver_id from t_order_list WHERE order_status = 3 and order_status = 4)',[router_type],
            function(error,result,fields) {
                if (error) {
                    reject('查询信息失败，error:'+error)
                  } else {
                   resolve(result)
                  }
            }
            )
        }
        else {
            DB.queryDB('select  driver_name,router_type,driver_schedule,router_note,driver_id,driver_is_substitutes from t_driver_schedule where schedule_month = ? and router_type = ? and driver_id not in (SELECT driver_id from t_order_list WHERE order_status != 3 and order_status != 4)',[current_month,router_type],function(error,result,fields){
                if (error) {
                  reject('查询信息失败，error:'+error)
                } else {
                 resolve(result)
                }
              })
        }
       
      }).then((data) => {
        let returnResult = []
        if (router_type == 4){
            returnResult = data
            console.log(returnResult)
        } else {
            for (var i=0;i<data.length;i++){
                let obj = data[i]
                let schedule = obj.driver_schedule.split('.')
                if(schedule.indexOf(current_date.toString()) == -1) {
                  returnResult.push(obj)
                }
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

// TODO:根据司机的类型查询车辆信息
// router.get('/car/query/',function(req,res,next){
//     // 如果是替班司机
//     // 非替班司机
// })

// TODO:查询实时订单
router.get('/order/query/',function(req,res,next){
    let parseObj = url.parse(req.url,true)
    let query = parseObj.query
    let limit = parseInt(query.limit)
    let offset = parseInt(query.offset)
    // 查询所有未支付和未派发的订单
    DB.queryDB('SELECT order_id,order_number,order_price,order_final_price,user_reserve_time,order_size,order_user_type,user_phone,user_adress,wechat_nickname,driver_name,driver_phone,user_place_order_img,order_created_time,order_status from v_order_list where order_status=0 or order_status=1 order by order_created_time LIMIT ? OFFSET ?',[limit,offset],function(error,result,fields){
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
                message: "sucess",
                data: result
              }
              res.send(responseJson)
        } 
    })
})

// 根据路线类型查询车辆
router.get('/car/query',function(req,res,next){
    console.log("测试")
    let parseObj = url.parse(req.url,true)
    let query = parseObj.query
    let router_type = parseInt(query.type);
    return new Promise((resolve,reject) => {
            DB.queryDB('SELECT * from t_car_list where car_router_type = ? and car_id not in (SELECT car_id from t_order_list WHERE order_status = 3 and order_status = 4)',[router_type],function(error,result,fields){
                if (error) {
                  reject('查询信息失败，error:'+error)
                } else {
                 resolve(result)
                }
              })
      }).then((data) => {  
        let responseJson = {
            code: 20000,
            message: 'success',
            data: data
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