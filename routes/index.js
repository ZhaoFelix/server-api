var express = require('express');
var router = express.Router();
var DB = require('../config/db')
var helper = require('../utils/helper')
//  扫描路由路径
const scanResult = helper.scanDirModules(__dirname,__filename)
for (const prefix in scanResult) {
  if (scanResult.hasOwnProperty(prefix)) {
    router.use(prefix,scanResult[prefix])
  }
} 
/* 仅用于服务器连接和数据库连接测试，不涉及相关功能 */
router.get('/', function(req, res, next) {
  DB.queryDB("select * from  t_user_list",function(error,results,fields){
    if (error){
      console.log("数据库连接测试失败，Error",error)
    } else {
      console.log("数据库连接测试成功。")
    }
  })
  res.render('index', { title: 'Express' });
});

module.exports = router;
