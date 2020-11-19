var express = require('express');
var router = express.Router();
var DB = require('../../../config/db');
var url = require('url');
const ENV = require('../../../config/env')
const SMSClient = require('@alicloud/sms-sdk')
let smsClient = new SMSClient({accessKeyId:ENV.ali.accessKeyId, secretAccessKey:ENV.ali.secretAccessKey})

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
module.exports = router;