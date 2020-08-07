// 引入express框架
const express = require('express');
// 连接数据库
require('./model/coonect')
    // web服务器
const app = express();
// 导入post请求获取模块
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
// 引入路由
// 登录接口
const login = require('./router/login')
    // 文章相关操作接口
const article = require('./router/article')
    // 评论相关接口
const comment = require('./router/comment')
const upload = require('./router/upload')


//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
// 配置post请求获取模块
app.use(bodyParser.urlencoded({ exrended: false }));
app.use(bodyParser.json()); //数据JSON类型

var multer = require('multer')
    //定义上传文件的储存位置
let objmulter = multer({ dest: 'upload' });
app.use(objmulter.single('file')); //


// 文件上传接收接口
app.post('/api/upload', (req, res) => {
    console.log(path.parse(req.file.originalname).ext); //使用Path.parse 结果的ext就是文件的扩展名
    let oldname = req.file.path //获取path: 'public\\upload\\0f625978d5d1a783b12e149718f8b634',
    let newname = req.file.path + path.parse(req.file.originalname).ext //.jpg
    fs.renameSync(oldname, newname) //将老的文件名改成新的有后缀的文件 #同步写法
    res.send({ err: 0, url: 'http://localhost:3000/upload/' + req.file.filename + path.parse(req.file.originalname).ext }); //返回给浏览器一些信息 一个磁盘地址
})

// 挂载路由
app.use(login)
app.use(article)
app.use(comment)


// 导入数据库模板
require('./model/user')


// 监听3000端口
app.listen(8099, () => console.log('服务器启动成功'));