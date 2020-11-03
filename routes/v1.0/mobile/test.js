var express = require('express')
var router = express.Router()

router.get('/',function(req,res,next){
   res.send({
       "message":"路由测试"
   })
});
module.exports = router


