// 引入express框架
const express = require('express');
// 创建路由
const article = express.Router();
// 引入user模块
const { Article, Articleverification } = require('../model/article.js');
// 引入路径拼接模块
const path = require('path');

// 文章添加接口
article.post('/article/addArticle', async(req, res) => {
    const data = req.body
        // 查询最后一条数据,并进行降序排列
    const exit = await Article.find({}).sort({ _id: -1 })
    if (exit.length == 0) {
        data.articleId = 1
    } else {
        data.articleId = exit[0].articleId + 1
    }
    await Articleverification(data).then((val) => {
        Article.create(val);
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

// 文章删除接口
article.delete('/article/delete', async(req, res) => {
    const { articleId } = req.query
    if (articleId && articleId !== null && articleId !== undefined) {
        var re = /^[0-9]+.?[0-9]*/; //判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/ 
        if (!re.test(articleId)) {
            return res.json({
                code: 1,
                data: null,
                msg: 'articleId is not number!'
            });
        } else {
            Article.remove({ articleId: articleId }).then(val => {
                if (val.n == 0) {
                    return res.json({
                        code: 1,
                        data: null,
                        msg: '此文章删除失败！'
                    });
                } else {
                    return res.json({
                        code: 0,
                        data: null,
                        msg: '删除文章成功！'
                    });
                }

            }).catch(err => {
                return res.json({
                    code: 1,
                    data: null,
                    msg: err.message
                });
            })
        }

    } else {
        return res.json({
            code: 1,
            data: null,
            msg: 'articleId is ' + articleId
        });
    }
})

// 文章点赞接口
article.post('/article/love', async(req, res) => {
    const { articleId } = req.body
    const data = await Article.findOne({ articleId: articleId })
    Article.update({ articleId: articleId }, { $set: { like_count: data.like_count + 1 } }).then(val => {
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

// 查询文章信息接口
article.get('/article/detail', async(req, res) => {
    const { articleId } = req.query
    await Article.findOne({ articleId: articleId }).then(val => {
        Article.update({ articleId, articleId }, { $set: { browse_count: val.browse_count + 1 } }).then(async() => {
            // 浏览量加一后重新获取并提出掉_id属性返回
            const data = await Article.findOne({ articleId: articleId }, { _id: 0 })
            return res.json({
                code: 0,
                data: data,
                msg: ''
            })
        }).catch(err => {
            return res.json({
                code: 1,
                data: null,
                msg: err
            })
        })
    }).catch(err => {
        return res.json({
            code: 1,
            data: null,
            msg: err
        })
    })

})

// 查询文章列表接口
article.get('/article/list', async(req, res) => {
    var { type, size, current } = req.query
        // type为类型0为全部 1为按时间查询 2为按热度查询
    if (!size) {
        size = 10
    } else {
        size = parseInt(size)
    }
    if (!current) {
        current = 0
    } else {
        current = parseInt(current) - 1
    }
    var pages = 0
        // // 跳过的数据条数
    let skipNum = current * size
        // 先查询表内数据条数
    Article.find({}).count().then(total => {
        pages = Math.ceil(parseInt(total) / size)
            // 如果没有数据
        if (total == 0) {
            return res.json({
                code: 0,
                data: {
                    pages: 0,
                    current: 1,
                    total: total,
                    records: [],
                    size: size
                },
                msg: ''
            })
        } else {
            // 再进行分页查询
            if (type == 1) {
                // 时间查询
                Article.find({}).sort({ create_time: -1 }).skip(skipNum).limit(size).then(val => {
                        return res.json({
                            code: 0,
                            data: {
                                pages: pages,
                                current: current,
                                total: total,
                                records: val,
                                size: size
                            },
                            msg: ''
                        })
                    }).catch(err => {
                        return res.json({
                            code: 1,
                            data: '',
                            msg: err
                        })
                    })
                    // 最新时间查询
            } else if (type == 2) {
                // 热度查询
                Article.find({}).sort({ like_count: -1 }).skip(skipNum).limit(size).then(val => {
                    return res.json({
                        code: 0,
                        data: {
                            pages: pages,
                            current: current,
                            total: total,
                            records: val,
                            size: size
                        },
                        msg: ''
                    })
                }).catch(err => {
                    return res.json({
                        code: 1,
                        data: '',
                        msg: err
                    })
                })
            } else {
                // 查询全部
                Article.find({}).skip(skipNum).limit(size).then(val => {
                    return res.json({
                        code: 0,
                        data: {
                            pages: pages,
                            current: current,
                            total: total,
                            records: val,
                            size: size
                        },
                        msg: ''
                    })
                }).catch(err => {
                    return res.json({
                        code: 1,
                        data: '',
                        msg: err
                    })
                })
            }
        }
    }).catch(err => {
        return res.json({
            code: 1,
            data: '',
            msg: err
        })
    })
})

module.exports = article;