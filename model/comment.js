// 评论集合
// 引入mongoose模块
const mongoose = require('mongoose')
    // 引入数据验证模块
const Joi = require('joi')
    // 创建评论集合
const commentSchema = new mongoose.Schema({
    // 关联的文章id
    articleId: {
        type: Number,
        required: true
    },
    // 唯一的评论id
    comment_id: {
        type: Number,
        required: true
    },
    // 评论创建时间
    create_time: {
        type: Date,
        default: Date.now
    },
    // 评论状态
    state: {
        type: Number,
        default: 0
    },
    // 用户评论
    content: {
        type: String,
        default: ''
    },
    // 评论回复
    reply: {
        type: String,
        default: ''
    },
    // 评论用户id
    user_id: {
        type: Number,
        default: 0
    }
})
const Comment = mongoose.model('Comment', commentSchema);
// 规则验证
const CommentVerification = comment => {
    const schema = {
        articleId: Joi.required().error(new Error('Product ID Incorrect')),
        comment_id: Joi.required().error(new Error('Product comment_id Incorrect')),
        content: Joi.string().required().error(new Error('请输入评论内容')),
    }
    return Joi.validate(comment, schema)
}

// 导出对象

module.exports = {
    Comment,
    CommentVerification
}