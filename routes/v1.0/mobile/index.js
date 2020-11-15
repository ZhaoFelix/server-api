var express = require('express');
var oss = require('../../../utils/oss');
var router = express.Router()

// 只用于移动端路由连接验证测试，不添加相关功能
router.get('/',function(req,res,next){
   res.send({
       "code":"移动端测试路由"
   })
});


module.exports = router


