/**
 * 订单处理
 * **/

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')

// TODO:指派司机
router.get('/driver/query',function(req,res,next){
    let date = new Date()
    let current_month = date.getMonth() + 1
    let current_date = date.getDate()
    let routerTypes = 
        {
            "1":"东风",
            "2":"网格",
            "3":"拉臂",
            "4":"第三方",
            "5":"桶装"
        }
    let returnResult = [
        {
            value:'',
            label:'',
            children:[{
                value:'',
                label:'',
                children:[{
                    value:'',
                    label:''
                }]
            }]
        }
    ]
    return new Promise((resolve,reject) => {
        let keyArr = Object.keys(routerTypes)
        // 循环数组
        for (let i=0;i<keyArr.length;i++) {
            // 根据路线类型查询今日值班司机信息
            DB.queryDB('select  * from t_driver_schedule where schedule_month = ? and router_type= ?',[current_month,keyArr[i]],function(error,result,fields){
                if (error) {
                  reject('查询信息失败，error:'+error)
                } else {
                    let returnResult = []
                    for (var i=0;i<result.length;i++){
                      let obj = result[i]
                      let schedule = obj.driver_schedule.split('.')
                      if(schedule.indexOf(current_date.toString()) == -1) {
                        returnResult.push(obj)
                      }
                    }
                  
                }
              })
        }
    })
})

module.exports = router