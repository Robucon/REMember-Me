var express=require('express')
//返回一个路由容器的实例
var router=express.Router()
//导入操作数据库的模型（index.js）
var User=require('../db').User
var auth=require('./auth')
//用来处理上传文件
var multer=require('multer')
//处理formdata的文件上传
var formidable=require('formidable')
//指定上传文件的存放目录
var upload=multer({dest:'./public'})
var path=require('path')
var fs=require('fs')
//注册页面
router.get('/new',function (req,res) {
    res.sendFile(path.resolve('build/index.html'))
})
//提交注册
router.post('/',upload.single('avatar'),function (req,res) {
    var body=req.body
    if(req.file){
        body.avatar = '/'+req.file.filename;
    }
    User.findOne({username:body.username},function (err,oldUser) {
        if(err){//数据库出现问题，导致出错
            req.session.err=err
            res.redirect('back')
        }
        else if(oldUser){
            req.session.err='用户名已被占用'
            //由于是form表单，只能返回了
            res.redirect('back')
        }
        else{
            User.create(body,function (err,doc) {
                if(doc){
                    console.log('000000000000000000000000000000000')
                    req.session.user = doc//把保存后的对象作为req.session;session对象是在服务器端内存放置的
                    res.redirect('/')
                }
            })
        }

    })
})
//修改页面
router.get('/:id',function (req,res) {
    res.sendFile(path.resolve('build/index.html'))

})
//提交修改
router.post('/:_id',auth.checkLogin,function (req,res) {
    var _id=req.params._id
    var user=Object.assign({},req.session.user)
    var form = new formidable.IncomingForm();
    form.uploadDir = './public'  // 存储路径
    form.parse(req, function(err, fields, files) {
        if(err){
            console.log(err)
            res.send(err) 
        }
        user.password=fields.password
        let imgPath = files.file.path // 获取文件路径
        if(!user.password==req.session.user.password){
            res.send({err:1,msg:'原始密码不正确'})
        }
        if(imgPath){
            let newImgPath=imgPath.replace('upload_','')
            fs.rename(imgPath,newImgPath,function (err) {
                if(err){
                    console.log(err,'改名失败')
                    res.send(err)
                }
                user.avatar=newImgPath.replace('public','')
                User.update({_id},user,function (err,data) {
                    if(err){//数据库出现问题，导致出错
                        req.session.err=err
                        res.redirect('back')
                    }
                    else{
                        console.log(user)
                        req.session.success='修改成功'
                        req.session.user=user
                        res.send({err:0,user})
                    }
                })

            })
        }else{
            User.update({_id},user,function (err,data) {
                if(err){//数据库出现问题，导致出错
                    res.redirect('back')
                }
                else{
                    console.log(user)
                    req.session.success='修改成功'
                    req.session.user=user
                    res.send({err:0,user})
                }
            })
        }


    });
    /*if(req.file){
        user.avatar = '/'+req.file.filename;
    }*/
    /*User.update({_id},user,function (err,data) {
        if(err){//数据库出现问题，导致出错
            req.session.err=err
            res.redirect('back')
        }
        else{
            console.log(user)
            req.session.success='修改成功'
            req.session.user=user
            res.send({err:0,user})
        }

    })*/
})



//路径以/开头，模板不能有/
/*
//当表单只有一个文件域的时候，可以用upload.single
//router.post('/singup',auth.checkNotLogin,upload.single('avatar'))
router.post('/signup',auth.checkNoLogin,upload.single('avatar'),function (req,res) {
    var body=req.body
    if(req.file){
        body.avatar = '/'+req.file.filename;
    }
        User.findOne({username:body.username},function (err,oldUser) {
            if(err){//数据库出现问题，导致出错
                req.session.err=err
                res.redirect('back')
            }
            else if(oldUser){
                req.session.err='用户名已被占用'
                res.redirect('back')
            }
            else{
                User.create(body,function (err,doc) {
                    if(doc){
                        req.session.user = doc//把保存后的对象作为req.session;session对象是在服务器端内存放置的
                        res.redirect('/')
                    }
                })
            }

        })
    })

//登录
router.get('/signin',auth.checkNoLogin,function (req,res) {
    //res.render('user/signin',{title:'登录'})
    res.sendFile(path.resolve('build/index.html'))

})
router.post('/signin',auth.checkNoLogin,function (req,res) {
    var body=req.body
    User.findOne(body,function (e,doc) {
        if(doc){
            req.session.user = doc
            res.redirect('/')
        }
        else{
            req.session.err='用户密码错误'
            res.send({err:'用户密码错误'})
        }
    })
})
*/
module.exports = router;
