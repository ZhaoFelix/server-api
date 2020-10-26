/*
开发环境与生产环境配置文件
*/

let dev = {
    env: 'development', //环境名称
    port: 3000, //服务端口号
    dbInfo: {
      connectionLimit: 200,
      host: '121.36.134.78',
      user: 'font1',
      password: 'font1qazwsx123',
      database: 'ningjin_trash',
      insecureAuth: true
    }
  }
  
  let prd = {
    env: 'production', //环境名称
    port: 3002, //服务端口号
    dbInfo: {
      connectionLimit: 200,
      host: '121.36.134.78',
      user: 'font1',
      password: 'font1qazwsx123',
      database: 'ningjin_trash',
      insecureAuth: true
    }
  }
  
  module.exports = {
    dev,
    prd
  }