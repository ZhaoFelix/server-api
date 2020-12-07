/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:54:40
 * @LastEditTime: 2020-12-07 15:56:50
 * @FilePath: /server-api/routes/v1.0/public/verify.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express');
var router = express.Router();
var DB = require('../../../config/db');
var url = require('url');
const ENV = require('../../../config/env')
const SMSClient = require('@alicloud/sms-sdk');
const { resolve } = require('path');
let smsClient = new SMSClient({accessKeyId:ENV.ali.accessKeyId, secretAccessKey:ENV.ali.secretAccessKey})

// 手机验证码
router.get('/verify', function (req, res, next) {
    let code = Math.random().toString().slice(-6); //随机生成6位验证码
    let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
    req.query = parseObj.query;
    let phone = req.query.phone;
    smsClient.sendSMS({
        PhoneNumbers:phone,
        SignName:ENV.ali.SignName,
        TemplateCode:ENV.ali.TemplateCode,
        TemplateParam:"{'code':"+code+"}"
    }).then(function(re){
        res.send(re);
       // 发送成功后将验证码存入
        DB.queryDB("INSERT  INTO `t_phone_code` (`phone_number`,`phone_code`,`phone_created_time`,`phone_deadline`)  VALUES(?,?,NOW(),DATE_ADD(NOW(),INTERVAL 10 MINUTE))",[phone,code],function(error,result,fields){
            if(error) {
                console.log("验证码入库失败")
            }
        })
    },function(err){
       console.log(err);
       let responseJson = {
        code: 20002,
        message: 'error',
        data: err
    }
    res.send(responseJson);
    })
})
// 确认手机号和验证码是否有效
router.post('/check', function(req, res, next) {
    let {checkCode, phone} = req.body
    DB.queryDB(
        'select * from `t_phone_code` where phone_number = ? and phone_is_deleted = 0 order by phone_created_time desc limit 1', [phone],
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: '查找验证码失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                console.log(result)
                var dataString = JSON.stringify(result);
                var data = JSON.parse(dataString);
                let {phone_code} = data[0]
                if(checkCode == phone_code) {
                    let responseJson = {
                        code: 20000,
                        message: '验证成功'
                    }
                    res.send(responseJson)
                } else {
                    let responseJson = {
                        code: 20000,
                        message: '请输入正确的验证码'
                    }
                    res.send(responseJson)
                }
            }
        }
    )
})

// 根据手机号进行物业角色认证
router.post('/checked', function(req, res, next) {
    let {phone,userId} = req.body
    return new Promise((resolve,reject) => {
    //根据手机号查询
    DB.queryDB("select estate_id from t_estate_list where estate_phone = ? and estate_is_deleted = 0",phone,function(error,result,fields){
        if (error) {
            reject("手机号查询失败，error"+error)
        } else {
            resolve(result)
        }
    })
   }).then((data) => {
       if(data.length == 0){
            // 记录不存在,无法进行认证
       } else {
        // 存在记录更新角色类型为1
       return new Promise((resolve,reject) => {
        DB.queryDB("update  t_user_list set  user_type = 1 where  user_id = ?",userId,function(error,result,fields){
            if (error){
                reject("更新用户角色失败，error"+error)
            } else {
                resolve(data)
            }
        })
       })
       }
   })
   .then((data) => {
     // 更新状态为已认证
     return new Promise((resolve,reject) => {
         DB.queryDB("update  t_estate_list set  estate_is_auth = 1,wechat_id = ?, estate_wechat_time = NOW() where  estate_is_deleted = 0  and estate_is_auth = 0 and estate_phone = ?",
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
        // 根据手机号查询信息
        DB.queryDB("select estate_id,estate_name,estate_phone,estate_card_id,estate_gender,estate_company,estate_region,estate_plot from t_estate_list where  estate_phone = ?",phone,function(error,result,fields){
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
        message: '认证成功，返回信息',
        data:data
    }
    res.send(responseJson)
   })
   .catch((error) => {
    let responseJson = {
        code: 20002,
        message: 'error',
        data: err
    }
    res.send(responseJson);
   })
})

module.exports = router;