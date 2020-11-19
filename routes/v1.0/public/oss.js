const express = require('express');
const router = express();
const MpUploadOssHelper = require("../../../utils/uploadOssHelper");


router.get('/getPostObjectParams', (req, res) => {
  const mpHelper = new MpUploadOssHelper({
    accessKeyId: 'LTAIhIVj0cdX1Fxh',
    accessKeySecret: 'm8l0EIM1ij4R60YtIiLGmwp6b28lx1',
    timeout: 1, // 限制参数的生效时间(单位：小时)。
    maxSize: 10, // 限制上传文件大小(单位：MB)。
  });

  // 生成参数。
  const params = mpHelper.createUploadParams();

  res.json(params);
})

module.exports = router