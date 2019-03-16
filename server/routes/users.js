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
module.exports = router;
