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

//查询商品列表数据
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
    //定义价格显示区间
    let priceLevel = req.param('priceLevel');
    //定义一个空参数对象
    let params = {};
    //定义价格最大和最小区间
    let priceGt = '', priceLte = '';
    if (priceLevel !== 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = parseInt('0');
                priceLte = parseInt('500');
                break;
            case '1':
                priceGt = parseInt('500');
                priceLte = parseInt('1000');
                break;
            case '2':
                priceGt = parseInt('1000');
                priceLte = parseInt('1500');
                break;
            case '3':
                priceGt = parseInt('1500');
                priceLte = parseInt('5000');
                break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        };
    }

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

//加入到购物车
router.post('/addCart', function (req, res, next) {
    //获取用户ID和用户信息
    const userId = '100000077',
        productId = req.body.productId;
    const User = require('../models/user');

    // 根据用户ID获取用户信息
    User.findOne({userId: userId}, function (err, userDoc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            //如果有用户信息就查询商品信息
            // 判断购物车是否有该商品信息
            if (userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach(function (goods) {
                    if (goods.productId === productId) {
                        goodsItem = goods;
                        goods.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save(function (err2, doc2) {
                        if (err2) {
                            res.json({
                                status: "1",
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'success'
                            })
                        }
                    })
                } else {
                    Goods.findOne({productId: productId}, function (err1, doc) {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: err1.message
                            })
                        } else {
                            if (doc) {
                                parseInt(doc.productNum);
                                doc.productNum = 1;
                                doc.checked = 1;
                                userDoc.cartList.push(doc);
                                userDoc.save(function (err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: "1",
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'success'
                                        })
                                    }
                                })
                            }
                        }
                    });
                }
            }
        }
    })
});

module.exports = router;

