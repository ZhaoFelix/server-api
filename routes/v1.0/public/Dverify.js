/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:54:40
 * @LastEditTime: 2020-12-13 20:14:05
 * @FilePath: /server-api/routes/v1.0/public/Dverify.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express');
var router = express.Router();
var DB = require('../../../config/db');
var url = require('url');

// 根据手机号进行司机角色认证
router.post('/checked', function(req, res, next) {
    let {phone,userId} = req.body
    return new Promise((resolve,reject) => {
    //根据手机号查询
    DB.queryDB("select driver_id from t_driver_list where driver_phone = ? and driver_is_deleted = 0",phone,function(error,result,fields){
        if (error) {
            reject("手机号查询失败，error"+error)
        } else {
            resolve(result)
        }
    })
}).then((data) => {
    if(data.length == 0){
            // 记录不存在,无法进行认证
            let responseJson = {
                code: 20001,
                message: '手机号不存在'
            }
            res.send(responseJson)
    } else {
        let responseJson = {
            code: 20000,
            message: '查询成功',
            data:data
        }
        res.send(responseJson)
    }
})
.catch((error) => {
    let responseJson = {
        code: 20002,
        message: 'error',
        data: error
    }
    res.send(responseJson);
})
})

// 认证更新状态
router.post("/auth",function(req,res,next){
    let {phone,userId} = req.body
       // 存在记录更新角色类型为1
    return new Promise((resolve,reject) => {
        DB.queryDB("update  t_user_list set  user_type = 2 where  user_id = ?",userId,function(error,result,fields){
            if (error){
                reject("更新用户角色失败，error"+error)
            } else {
                resolve(result)
            }
        })
    })
    .then((data) => {
        // 更新状态为已认证
        return new Promise((resolve,reject) => {
        DB.queryDB("update  t_driver_list set  driver_is_auth = 1,wechat_id = ?, driver_wechat_time = NOW() where  driver_is_deleted = 0  and driver_is_auth = 0 and driver_phone = ?",
        [userId,phone],function(error,result,fields){
        if (error) {
            reject("更新角色状态失败，error"+error)
            } else {
                resolve(result)
            }
            })
        }) 
    })
    .then((data) => {
        let responseJson = {
            code: 20000,
            message: '认证成功',
            data:data
        }
        res.send(responseJson)
    })
    .catch((error) => {
        let responseJson = {
            code: 20002,
            message: 'error',
            data: error
        }
        res.send(responseJson);
    })
})

// 根据手机号获取司机信息
router.get("/driver",function(req,res,next){
    let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
    req.query = parseObj.query;
    let phone = req.query.phone;
    // 根据手机号查询信息
    return new Promise((resolve,reject) => {
        DB.queryDB("select driver_id,driver_name,driver_phone,driver_card_id,router_note from t_driver_list where  driver_phone = ?",[phone],function(error,result,fields){
                if (error) {
                    reject("手机号查询信息失败，error"+error)
                } else {
                    resolve(result)
                }
            })
    })
    .then((data) => {
        let responseJson = {
            code: 20000,
            message: '认证成功',
            data:data
        }
        res.send(responseJson)
    })
    .catch((error) =>{
        let responseJson = {
            code: 20002,
            message: 'error',
            data: error
        }
        res.send(responseJson);
    })
})
module.exports = router;