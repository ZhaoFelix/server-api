var config = require('../../../config/env')
// var OSS = require('ali-oss')

// let client = new OSS({
//   bucket: config.oss_config.bucket,
//   region: config.oss_config.region,
//   // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
//   accessKeyId: config.oss_config.accessKeyId,
//   accessKeySecret: config.oss_config.accessKeySecret
// });
const OSS = require('ali-oss')
const STS = OSS.STS
const express = require('express');
const router = express();


const stsClient = new STS({
  accessKeyId: config.oss_config.accessKeyId,
  accessKeySecret: config.oss_config.accessKeySecret,
  bucket: config.oss_config.bucket
});

async function getToken() {
    const STS_ROLE = '<STS_ROLE>'  // 指定角色的ARN。格式：acs:ram::$accountID:role/$roleName。
    const STSpolicy = {
      Statement: [
        {
          Action: ['oss:*'],
          Effect: 'Allow',
          Resource: ['acs:oss:*:*:*']
        }
      ],
      Version: '1'
    };
    const result = await stsClient.assumeRole(
      STS_ROLE,
      STSpolicy,
      3600 // STS过期时间，单位：秒。
    );
    const { credentials } = result;

    return credentials;
}

router.get('/getToken', async (req, res) => {
  // 获取STS。
  const credentials = await getToken()
  console.log(credentials.AccessKeyId)
  console.log(credentials.AccessKeySecret)
  console.log(credentials.SecurityToken)
  res.json(credentials);
})

module.exports = router