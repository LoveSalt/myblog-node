// 引入express框架
const express = require('express');
// 创建路由
const upload = express.Router();

upload.post('/upload', (res, req) => {
    console.log(req.body); //获取到的age和name
    console.log(req.files); //获取到的文件

})

module.exports = upload;