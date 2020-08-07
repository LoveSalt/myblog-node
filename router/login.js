// 引入express框架
const express = require('express');
// 创建路由
const login = express.Router();
// 引入user模块
const { User, verification } = require('../model/user.js');
// 引入路径拼接模块
const path = require('path');

// 注册板块
login.post('/login/getRegister', async(req, res) => {
        const { email, password, username } = req.body;
        // // 判断是否都填写了
        if (password.trim().length == 0) {
            return res.json({
                code: 1,
                data: null,
                msg: '请输入密码'
            });
        } else if (email.trim().length == 0) {
            return res.json({
                code: 1,
                data: null,
                msg: '请输入邮箱'
            });
        } else if (username.trim().length == 0) {
            return res.json({
                code: 1,
                data: null,
                msg: '请输入用户名'
            });
        } else {
            // 在数据库中查询是否存在此邮箱
            const exit = await User.findOne({ email })
            if (exit) {
                return res.json({
                    code: 1,
                    data: null,
                    msg: '用户已存在'
                });
            } else {
                // 对密码加密
                // let salt = await bcrypt.genSalt(10);
                // let pass = await bcrypt.hash(password, salt);
                // req.body.password = pass;
                // 将用户数据添加至数据库中
                await User.create({
                    email: email,
                    username: username,
                    password: password,
                    role: '超级用户',
                    state: 1
                });
                return res.json({
                    code: 0,
                    data: null,
                });
            }
        }

    })
    // 用户登录
login.get('/login/UserLogin', async(req, res) => {
    const { email, password } = req.query
    const user = await User.findOne({ email })
    if (user) {
        if (password.trim() == user.password.trim()) {
            return res.json({
                code: 0,
                data: {
                    token: '123'
                }
            });
        } else {
            return res.json({
                code: 1,
                data: null,
                msg: '密码错误'
            });
        }
    } else {
        return res.json({
            code: 1,
            data: null,
            msg: '用户不存在！'
        });
    }
})

module.exports = login;