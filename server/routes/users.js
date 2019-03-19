const express = require('express');
const router = express.Router();
const User = require('./../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//登录接口
router.post("/login", function (req, res, next) {
    let param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    };
    User.findOne(param, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            });
        } else {
            if (doc) {
                //存入cookie
                res.cookie("userId", doc.userId, {
                    //设置存放cookie至根目录
                    path: "/",
                    //设置cookie存放周期
                    maxAge: 1000 * 60 * 60//一小时
                });
                res.cookie("userName", doc.userName, {
                    //设置存放cookie至根目录
                    path: "/",
                    //设置cookie存放周期
                    maxAge: 1000 * 60 * 60//一小时
                });
                //存入session
                // req.session.user = doc;
                res.json({
                    status: "0",
                    msg: "",
                    result: {
                        userName: doc.userName,
                    }
                })
            }
        }
    })
});

//登出接口
router.post("/logout", function (req, res, next) {
    res.cookie("userId", "", {
        path: '/',
        maxAge: -1
    });
    res.cookie("userName", "", {
        path: '/',
        maxAge: -1
    });
    res.json({
        status: 0,
        msg: '',
        result: ''
    })
});

//检查登录状态接口
router.get('/checkLogin', function (req, res, next) {
    if (req.cookies.userId) {
        res.json({
            status: '0',
            msg: '',
            result: req.cookies.userName
        })
    } else {
        res.json({
            status: '1',
            msg: '暂未登录',
            result: ''
        })
    }
});

//取得当前用户的的购物车数据
router.get('/cartList', function (req, res, next) {
    const userId = req.cookies.userId;
    User.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList
                })
            }
        }
    })
});

//删除购物车数据
router.post('/delCart', function (req, res, next) {
    const userId = req.cookies.userId, productId = req.body.productId;
    User.update({userId: userId},
        {
            $pull: {
                'cartList':
                    {'productId': productId}
            }
        }, function (err, doc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                res.json({
                    status: '0',
                    msg: '',
                    result: '删除成功'
                })
            }
        }
    )
});

//修改商品数量
router.post('/editCart', function (req, res, next) {
    const userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked;
    User.update({userId: userId, "cartList.productId": productId}, {
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked
    }, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: '修改成功'
                })
            }
        }
    })
});

//商品全选功能
router.post('/editCheckAll', function (req, res, next) {
    const userId = req.cookies.userId,
        checkAll = req.body.checkAllFlag ? '1' : '0';
    User.findOne({userId: userId}, function (err, user) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (user) {
                user.cartList.forEach((item) => {
                    item.checked = checkAll;
                    console.log(item.checked)
                });
                user.save(function (err1, doc) {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err.message,
                            result: ''
                        })
                    } else {
                        res.json({
                            status: '0',
                            msg: '',
                            result: 'suc'
                        })
                    }
                })
            }
        }
    })
});
module.exports = router;
