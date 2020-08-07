// 导入数据库模块
const mongoose = require('mongoose')
    // mongoose.connect('mongodb://chang:chang@localhost:27017/blog', {useNewUrlParser: true })
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true })
    .then(() => console.log('数据库连接成功'))
    .catch((err) => console.log('数据库连接失败', err))