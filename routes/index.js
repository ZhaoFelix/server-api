var express = require('express');
var router = express.Router();
var DB = require('../config/db')

/* GET home page. */
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
