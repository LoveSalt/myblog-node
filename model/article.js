// 引入mongoose模块
const mongoose = require('mongoose');
// 引入加密模块
// const bcrypt = require('bcrypt');
// // 引入数据验证模块
const Joi = require('joi');
// 创建用户集合
const articleSchema = new mongoose.Schema({
    // 文章标题
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },
    // 文章内容
    content: {
        type: String,
        required: true,
    },
    // 文章Id
    articleId: {
        type: Number,
        default: 1,
        required: true,
    },
    // 文章创建时间
    create_time: {
        type: Date,
        default: Date.now
    },
    // 文章分类
    cate_id: {
        type: Number,
        default: 1
    },
    // 文章封面
    img: {
        type: String,
    },
    // 浏览人数
    browse_count: {
        type: Number,
        default: 0
    },
    // 评论人数
    comment_count: {
        type: Number,
        default: 0
    },
    // 点赞人数
    like_count: {
        type: Number,
        default: 0
    },
    // 文章描述
    description: {
        type: String,
        default: ''
    },
    // 文章状态是否可见
    state: {
        type: Number,
        default: 1
    }
});

const Article = mongoose.model('Article', articleSchema);


// 规则验证
const ArticleVerification = article => {
    const schema = {
        title: Joi.string().min(3).max(15).required().error(new Error('请输入长度在3-15的标题')),
        articleId: Joi.required().error(new Error('Product ID Incorrect')),
        content: Joi.string().required().error(new Error('请输入文章内容')),
        description: Joi.string(),
    }
    return Joi.validate(article, schema)
}

module.exports = {
    Article,
    ArticleVerification
}