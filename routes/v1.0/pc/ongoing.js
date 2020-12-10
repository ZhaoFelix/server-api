/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-10 13:26:52
 * @LastEditTime: 2020-12-10 13:29:00
 * @FilePath: /server-api/routes/v1.0/pc/ongoing.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')

router.get("/driver",function(req,res,next){
    DB.queryDB("select  * from v_assign_order",function(error,result,fields){
        if (error) {
            let responseJson = {
                code: 20002,
                message: '创建订单失败',
                data: error
            }
            res.send(responseJson)
        } else {
            let responseJson = {
                code: 20000,
                message: '支付配置成功',
                data: result
            }
            res.send(responseJson)
        }
    })
})

module.exports = router