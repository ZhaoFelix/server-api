var oss = require('ali-oss')

var client = oss({
    accessKeyId: 'LTAIhIVj0cdX1Fxh',
    accessKeySecret: 'm8l0EIM1ij4R60YtIiLGmwp6b28lx1',
    region: 'oss-cn-hangzhou'
});

var ali_oss = {
    bucket: 'supers1',  //阿里云您的bucket
    endPoint: 'oss-cn-hangzhou.aliyuncs.com', //填写你开通的oss地址
}


async function listBuckets () {
    try {
        let result = await client.listBuckets();
        console.log(result)
    } catch(err) {
        console.log(err)
    }
}
// 上传本地文件
async function put () {
    try {
        //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        let result = await client.put('object-name', '1.png');
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    listBuckets: listBuckets,
    put: put
}