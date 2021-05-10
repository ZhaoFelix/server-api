/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-04-06 10:36:30
 * @LastEditTime: 2021-05-10 21:45:34
 * @FilePath: /server-api/routes/v1.0/public/osInfo.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var os = require('os')
var Result = require('../../../utils/result')
router.get('/verify', function (req, res, next) {
  DB.queryDB('', function (error, result, fields) {
    if (error) {
      new Result(error, 'error').fail(res)
    } else {
      new Result('接口运行正常', 'success').success(res)
    }
  })
})
router.get('/info', function (req, res, next) {
  // 处理器架构
  var arch = os.arch()
  // cpu信息
  var cpus = os.cpus()
  // 空闲内存字节
  var freemem = os.freemem()
  //  总的内存
  var totalmem = os.totalmem()
  // 当前用户的根目录
  var homedir = os.homedir()
  //   主机名称
  var hostname = os.hostname()

  //  系统运行时长
  var uptime = os.uptime()

  // 最近5，10，15分钟的平均负载
  var loadavg = os.loadavg()
  // 操作系统名称
  var type = os.type()
  // 操作系统版本
  var release = os.release()

  //  操作系统类型
  var platform = os.platform()
  //   操作系统临时文件的默认目录
  var tmpdir = os.tmpdir()
  //   网络配置列表
  var networkInterfaces = os.networkInterfaces()
  // 用户信息
  var userinfo = os.userInfo()
  let data = {
    arch: arch,
    // cpus: cpus,
    freemem: (freemem / 1024 / 1024 / 1024).toFixed(2),
    totalmem: (totalmem / 1024 / 1024 / 1024).toFixed(2),
    homedir: homedir,
    hostname: hostname,
    uptime: (uptime / 3600).toFixed(0),
    loadavg: loadavg,
    type: type,
    release: release,
    platform: platform,
    tmpdir: tmpdir,
    userinfo: userinfo
    // networkInterfaces: networkInterfaces
  }
  new Result(data, 'success').success(res)
})

router.get('/dbinfo', function (req, res, next) {
  DB.queryDB(
    `
    show global status  where  
                       Variable_name like  '%uptime%' or  Variable_name = 'Bytes_sent' or  Variable_name like  'Bytes_received' 
                        or Variable_name like '%connections%'
                        or  Variable_name like  'Threads%' or Variable_name like  'Open_tables'
                        or Variable_name like  'Com_select' or Variable_name like  'Com_insert' or Variable_name like  'Com_update';
    `,
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

router.get('/topten', function (req, res, next) {
  DB.queryDB(
    'select  wechat_nickname,user_type,wechat_last_time,wechat_avatar from t_user_list   order  by  wechat_last_time  desc limit 0,10',
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

router.get('/newten', function (req, res, next) {
  DB.queryDB(
    'select  wechat_nickname,user_type,wechat_created_time,wechat_avatar from t_user_list   order  by  wechat_created_time  desc limit 0,10',
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

module.exports = router
