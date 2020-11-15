var config = require('../config/env')
var OSS = require('ali-oss')

let client = new OSS({
  bucket: config.oss_config.bucket,
  region: config.oss_config.region,
  // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
  accessKeyId: config.oss_config.accessKeyId,
  accessKeySecret: config.oss_config.accessKeySecret
});

module.exports = {
    client
}