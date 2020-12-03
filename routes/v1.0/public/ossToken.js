const config = require('../../../config/env')
const express = require('express');
const router = express();
const ossHelper = require("../../../utils/ossHelper")

router.get("/getOssToken",(req,res) => {
    const myHelper = new ossHelper({
        accessKeyId:config.oss_config.accessKeyId,
        accessKeySecret:config.oss_config.accessKeySecret,
        timeOut:1, // 有效时长1小时
        maxSize:10 // 限制文件大小（单位：MB）
    })
    // 生成参数
    const params = myHelper.createUploadParams();

    res.json({
        code:"20000",
        message:"获取osstoken成功",
        data:params
    })
})

module.exports = router
