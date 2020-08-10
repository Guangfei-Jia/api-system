const config_sign = require('../config/config_sign');   //秘钥配置
const jwt = require('jsonwebtoken');                    //token操作模块
//生成和验证token
module.exports = {
    //生成token
    setToken: (payload, time) => {
        return new Promise((resolve, reject) => {
            const token = jwt.sign(payload, config_sign.secretKey, {expiresIn: time});
            resolve(token)
        }).catch((err) => {
            console.log(err);
        })
    },
    //校验token是否过期
    verToken: (token) => {
        return new Promise((resolve, reject) => {
            const userinfo = jwt.verify(token.split(' ')[1], config_sign.secretKey);
            resolve(userinfo);
        }).catch((err) => {
            console.log(err);
        })
    }
}