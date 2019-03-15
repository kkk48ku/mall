var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "userId": {type: String},
    "userName": {type: String},
    "userPwd": {type: String},
    "orderList": {type: Array},
    "cartList": [
        {
            "productId": {type: String},
            "productName": {type: String},
            "salePrice": {type: String},
            "productImage": {type: String},
            "checked": {type: String},
            "productNum": {type: String}
        }
    ],
    "addressList": {type: Array}
    /*[
        {
            "addressId": {type: String},
            "userName": {type: String},
            "streetName": {type: String},
            "postCode": {type: String},
            "tel": {type: String},
            "isDefault": {type: String}
        }
    ]*/
});

module.exports = mongoose.model('User', userSchema);
