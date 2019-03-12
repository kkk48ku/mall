var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//链接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall', {useNewUrlParser: true});

//已连接
mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success. ")
});
//链接失败
mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail. ")
});
//断开连接
mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected. ")
});

router.get('/', function (req, res, next) {

    /*
    * 商品列表分页及排序功能实现
    * */
    //获取第几页的String并转化为Number
    let page = parseInt(req.param('page'));
    //获取每页数据条数的String并转换为Number
    let pageSize = parseInt(req.param('pageSize'));
    //获取排序参数1为升序-1为降序
    let sort = req.param('sort');
    //用skip方法定义跳过的数据数量
    let skip = (page - 1) * pageSize;
    //定义一个空参数对象
    let params = {};
    //用limit方法确定每页显示数量
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    //用sort方法接受sort参数定义排序方式
    goodsModel.sort({'salePrice': sort});
    goodsModel.exec(function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: error.message
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});


module.exports = router;

