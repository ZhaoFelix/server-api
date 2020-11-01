var mysql = require('mysql')
let config = require('./env')
创建一个连接池
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
          console.log('查询失败' + err)
          // throw err
        }
        //查询结束后关闭数据库连接
        connection.release() //释放连接
        //将查询出来的结果返回给回调函数
        callback(err, results, fields)
      })
    }
  })
}

module.exports = {
  queryDB
}
