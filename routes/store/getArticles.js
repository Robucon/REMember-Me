//http://www.jianshu.com/c/V2CqjW
var request=require('request')
var conv=require('iconv-lite')//转码的
var fs=require('fs')
var cheerio=require('cheerio')
var url='http://www.jianshu.com/c/V2CqjW'
var arr=[]
var getArticles=function (cb) {
    request({url,encoding:null},function (err,response,body) {
        body=conv.decode(body,'utf-8')
        let $=cheerio.load(body)
        $('#list-container ul li').each(function () {
            let $item=cheerio.load(this)
            let title=$item('.title').text()
            let description=$item('.abstract').text()
            let _id=$item('.title').attr('href').replace('/','')
            let username=$item('.author .name .blue-link').text()
            let createAt=$item('.author .name .time').attr('data-shared-at')
            let user={avatar:'http://reactchina.sxlcdn.com/letter_avatar_proxy/v2/letter/o/e0b2c6/45.png',username}
            let obj={title,description,user,_id,createAt}
            arr.push(obj)
        })
        cb(arr)
    })

}
module.exports =getArticles
/*
getArticles(function (data) {
    console.log(data)
})*/
