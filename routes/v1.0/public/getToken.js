const config1 = require('../../../config/env')
const express = require('express');
const router = express();
const crypto = require("crypto")

const config = {
    dirPath: 'xxx/', // 存放到哪个目录下
    bucket: config1.oss_config.bucket,
    region: config1.oss_config.region,// 我的是 hangzhou
    accessKeyId: config1.oss_config.accessKeyId,
    accessKeySecret: config1.oss_config.accessKeySecret,
    expAfter: 300000, // 签名失效时间，毫秒
    maxSize: 1048576000 // 文件最大的 size
}

router.get('/osstoken', (req, res) => {
    const host = `https://${config.bucket}.${config.region}.aliyuncs.com`
    const expireTime = new Date().getTime() + config.expAfter
    const expiration = new Date(expireTime).toISOString()
    const policyString = JSON.stringify({
        expiration,
        conditions: [
            ['content-length-range', 0, config.maxSize],
            ['starts-with', '$key', config.dirPath]
        ]
    })
    const policy = Buffer.from(policyString).toString('base64')

    const signature = crypto.createHmac('sha1', config.accessKeySecret).update(policy).digest("base64")

    res.json({
        signature,
        policy,
        host,
        'OSSAccessKeyId': config.accessKeyId,
        'key': expireTime,
        'success_action_status': 201,
        'dirPath': config.dirPath,
    })
})

module.exports = router