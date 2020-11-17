var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
const { off } = require('process')

// 查询所有的订单
router.get('/query/all',function(req,res,next){
    console.log('测试')
    let parseObj = url.parse(req.url,true)
    let query = parseObj.query
    let limit = parseInt(query.limit)
    let offset = parseInt(query.offset)
    DB.queryDB('SELECT order_id,order_number,order_price,order_final_price,user_reserve_time,order_size,order_user_type,user_phone,user_adress,wechat_nickname,driver_name,driver_phone,user_place_order_img,order_created_time,order_status from v_order_list order by order_created_time LIMIT ? OFFSET ?',[limit,offset],function(error,result,fields){
        if (error) {
            let responseJson = {
              code: 20002,
              message: error,
              data: '查询用户名失败'
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

module.exports = router
