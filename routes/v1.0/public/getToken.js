const OSS = require('ali-oss')
const STS = OSS.STS
const express = require('express');
const router = express();


const stsClient = new STS({
  accessKeyId: 'LTAIhIVj0cdX1Fxh',
  accessKeySecret: 'm8l0EIM1ij4R60YtIiLGmwp6b28lx1',
  bucket: 'supers1'
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