// 引入mongoose模块
const mongoose = require('mongoose');
// 引入加密模块
// const bcrypt = require('bcrypt');
// // 引入数据验证模块
const Joi = require('joi');
// 创建用户集合
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 5
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
    },
    state: {
        type: Number,
        default: 0
    }
});
// 创建用户集合
const User = mongoose.model('User', userSchema);
async function encrypt() {
    // 生成随机字符
    // let salt = await bcrypt.genSalt(10);
    // 加密
    // const pass = await bcrypt.hash('123456', salt);
    await User.create({
        username: '老王',
        email: 'laowang@shihundan.cn',
        password: '123456',
        role: '超级用户',
        state: 0
    })
}
// 写入数据库数据
// encrypt()

// 规则验证
const verification = user => {
    const schema = {
        username: Joi.string().min(2).max(10).required().error(new Error('用户名错误')),
        email: Joi.string().email().required().error(new Error('邮箱格式不符合要求')),
        password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/).error(new Error('密码格式不符合要求')),
        role: Joi.string().valid('普通用户', '超级用户').required().error(new Error('角色值非法')),
        state: Joi.number().valid(0, 1).required().error(new Error('状态值非法'))
    }
    return Joi.validate(user, schema)
}

module.exports = {
    User,
    verification
}