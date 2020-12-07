/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-01 07:54:40
 * @LastEditTime: 2020-12-07 15:11:10
 * @FilePath: /server-api/routes/v1.0/public/verify.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express');
var router = express.Router();
var DB = require('../../../config/db');
var url = require('url');
const ENV = require('../../../config/env')
const SMSClient = require('@alicloud/sms-sdk')
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

// 
module.exports = router;