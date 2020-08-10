//数据库配置
var MAIL_CONFIG = {
    HOST: 'smtp.qq.com',        // QQ邮箱服务器，   host:'smtp.163.com',//163邮箱的服务器
    PORT: 465,                  // SMTP 端口
    CONNECTION: true,     // 使用了 SSL
    // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
    USER: '2903383817@qq.com',
    PASS: 'fjtvoiqrcukaddgb'    //邮箱SMTP和POP3授权码
}

module.exports = {
    MAIL_CONFIG
};