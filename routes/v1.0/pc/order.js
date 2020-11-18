var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')

// 查询所有的订单
router.get('/query/all',function(req,res,next){
    let parseObj = url.parse(req.url,true)
    let query = parseObj.query
    let limit = parseInt(query.limit)
    let offset = parseInt(query.offset)
    DB.queryDB('SELECT order_id,order_number,order_price,order_final_price,user_reserve_time,order_size,order_user_type,user_phone,user_adress,wechat_nickname,driver_name,driver_phone,user_place_order_img,order_created_time,order_status from v_order_list order by order_created_time LIMIT ? OFFSET ?',[limit,offset],function(error,result,fields){
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

// TODO:删除订单

// TODO:订单允许二次预约下单

// TODO:查询所有进行中的订单，已支付但未派车，已支付且已派车

// TODO:根据订单号查询订单

module.exports = router
