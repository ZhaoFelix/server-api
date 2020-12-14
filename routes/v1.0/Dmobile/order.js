/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-09 14:28:16
 * @LastEditTime: 2020-12-14 13:55:22
 * @FilePath: /server-api/routes/v1.0/Dmobile/order.js
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
    let userId = req.query.userId === undefined ? 107 : req.query.userId
    console.log(userId)
    DB.queryDB("select  * from v_assign_order where  driver_id = ?",userId,function(error,result,next){
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

// 根据车辆ID和司机ID查询信息
router.get("/query/info",function(req,res,next){
    let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
    req.query = parseObj.query;
    let driver_id = req.query.driverId
    let car_id = req.query.carId 
    DB.queryDB("select  a.car_number,b.driver_name,b.driver_phone from  t_car_list as a, t_driver_list as b where a.car_id = ? and b.driver_id = ?",[car_id,driver_id],function(error,result,fields){
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

// 更新订单状态为4，司机前往目的地
router.get("/update/status4",function(req,res,next){
    let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
    req.query = parseObj.query;
    let order_id = req.query.orderId
    DB.queryDB("update t_order_list set order_status = 4 where order_id = ? and order_status = 3",order_id,function(error,result,fields){
        if (error) {
            let responseJson = {
                code: 20002,
                message: '更新状态失败',
                data: error
            }
            res.send(responseJson)
        } else {
        DB.queryDB("update  t_order_info_list set driver_go_des = now() where  order_id = ?",order_id,function(error,result,fields){
            if (error) {
                let responseJson = {
                    code: 20002,
                    message: '更新时间失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                let responseJson = {
                    code: 20000,
                    message: '更新成功',
                    data: result
                }
                res.send(responseJson) 
            }
        })
        }
    })    
})

// 到达目的地
router.get("/update/reachDes",function(req,res,next){
    let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
    req.query = parseObj.query;
    let order_id = req.query.orderId
        DB.queryDB("update  t_order_info_list set driver_reach_des = now() where  order_id = ?",order_id,function(error,result,fields){
            if (error) {
                let responseJson = {
                    code: 20002,
                    message: '更新时间失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                let responseJson = {
                    code: 20000,
                    message: '更新成功',
                    data: result
                }
                res.send(responseJson) 
            }
        })   
})
// 完成清算
router.post("/update/getimage",function(req,res,next){
    let {orderId,getImageList} = req.body 
        DB.queryDB("update t_order_info_list set driver_get_img = ? , driver_get_time = now() where  order_id = ?",
        [JSON.stringify(getImageList),orderId],function(error,result,fields){
            if (error) {
                let responseJson = {
                    code: 20002,
                    message: '更新时间失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                let responseJson = {
                    code: 20000,
                    message: '更新成功',
                    data: result
                }
                res.send(responseJson) 
            }
        })   
})
module.exports = router
