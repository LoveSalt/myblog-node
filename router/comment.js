// 引入express框架
const express = require('express');
// 创建路由
const comment = express.Router();
// 引入user模块
const { Comment, CommentVerification } = require('../model/comment.js');
// 引入路径拼接模块
const path = require('path');

// 添加评论
comment.post('/comment/add', async(req, res) => {
    const data = req.body
    const exit = await Comment.find({}).sort({ _id: -1 })
    if (exit.length == 0) {
        data.comment_id = 1
    } else {
        data.comment_id = exit[0].comment_id + 1
    }
    await CommentVerification(data).then((val) => {
        Comment.create(val);
        return res.json({
            code: 0,
            data: null,
            msg: '成功！'
        });
    }).catch((err) => {
        console.log(err)
        return res.json({
            code: 1,
            data: null,
            msg: err.message
        });
    })
})

// 评论回复
comment.post('/comment/add', async(req, res) => {
    const { comment_id, reply } = req.body
    Comment.update({ comment_id: comment_id }, { $set: { reply: reply } }).then(val => {
        return res.json({
            code: 0,
            data: null,
            msg: '点赞成功！'
        })
    }).catch(err => {
        return res.json({
            code: 1,
            data: null,
            msg: err
        })
    })

})

module.exports = comment;