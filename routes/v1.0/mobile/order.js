/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-09 14:28:16
 * @LastEditTime: 2020-12-09 14:35:13
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
    DB.queryDB("",userId,function(req,res,next){
        
    })
})
module.exports = router
