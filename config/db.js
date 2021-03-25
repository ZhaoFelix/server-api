/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-03 08:34:04
 * @LastEditTime: 2021-03-25 13:21:35
 * @FilePath: /server-api/config/db.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var mysql = require('mysql')
let config = require('./env')
// 创建一个连接池
let pool = mysql.createPool(
  process.env.NODE_ENV == config.prd.env ? config.prd.dbInfo : config.dev.dbInfo
)

//数据库查询，查询时的默认参数为空
function queryDB(sql, params = '1', callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log('连接失败' + err)
    } else {
      connection.query(sql, params, function (err, results, fields) {
        if (err) {
          connection.release() //释放连接
          console.log('查询失败' + err)
          // throw err
        }

        //将查询出来的结果返回给回调函数
        callback(err, results, fields)
      })
      //查询结束后释放连接池，等待待别的连接池使用
      pool.releaseConnection(connection)
    }
  })
}

// function queryDB(sql, params = '1', callback) {
//   pool.query(sql, params, function (err, results, fields) {
//     if (err) {
//       console.log('查询失败' + err)
//     }
//     callback(err, results, fields)
//   })
// }

module.exports = {
  queryDB
}
