/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-09 14:28:16
 * @LastEditTime: 2020-12-09 16:20:43
 * @FilePath: /server-api/routes/v1.0/mobile/order.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require("express");
var DB = require("../../../config/db")
var router = express.Router();
var url = require('url');
// 根据用户ID查询订单
router.get("/query",function(req,res,next){
    let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
    req.query = parseObj.query;
    let userId = req.query.userId
    /*
    car_id: null
driver_id: null
order_created_time: "2020-12-09T05:12:50.000Z"
order_final_price: 1
order_id: 18
order_is_deleted: 0
order_num: 0
order_number: "mp160749077017052743"
order_pay_time: "2020-12-09T06:17:05.000Z"
order_price: 515
order_size: 98
order_status: 1
order_type: null
order_user_name: "赵庆飞"
order_user_type: 1
user_address: "上海市小区"
user_id: 7
user_is_first: 1
user_note: ""
user_phone: "15021179915"
user_reserve_time: "2020-12-09T06:20:00.000Z"
    */
    DB.queryDB("select  order_id,order_final_price,order_number,user_address,car_id,driver_id,user_reserve_time,order_status from t_order_list where user_id = ?  and order_is_deleted = 0",userId,function(error,result,next){
        if (error) {
            let responseJson = {
                code: 20002,
                message: '查询失败',
                data: error
              }
              res.send(responseJson)
        } else {
            let responseJson = {
                code: 20000,
                message: '查询成功',
                data: result
              }
              res.send(responseJson)
        }
    })
})
module.exports = router
