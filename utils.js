const nodemailer = require('nodemailer');
const { MAIL_CONFIG } = require('./config/config_pub');
const fs = require('fs');
const path = require('path');

//发送邮件
const sendMail = user => {
    let transporter = nodemailer.createTransport({
        host: MAIL_CONFIG.HOST,       // 163邮箱服务器，   host:'smtp.qq.com',//QQ邮箱的服务器
        port: MAIL_CONFIG.PORT,                  // SMTP 端口
        secureConnection: MAIL_CONFIG.CONNECTION,     // 使用了 SSL
        // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
        auth: {
            user: MAIL_CONFIG.USER,
            pass: MAIL_CONFIG.PASS    //邮箱SMTP和POP3授权码
        }
    })
    var mailOptions = {
        from: `"xxxxx发送邮件公司名称" <${MAIL_CONFIG.USER}>`, // 发送邮件的地址 // login user must equal to this user
        to: user.email, //接收邮件地址
        subject: '你有一条新消息',// 邮件主题
        html: `<div style="color:red;">${user.username},您好，您的密码已经初始化为Qwer@1234：</div>` //以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
    };
    return transporter.sendMail(mailOptions);
}

//成功信息返回
const successMessage = (message, data = {}) => {
    return {
        code: 0,
        message: message,
        data: data
    }
}

//报错返回信息
const errorMessage = message => {
    return {
        code: -1,
        message: message,
        data: []
    }
}

//判断传递的数据是否无效
const isEmptys = value => {
    return value === undefined || value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
}

//对象数组去重
const arrayRepeatForReduce = (arrs, key) => {
    let obj = {};
    return arrs.reduce((prev, next) => {
        if (next) {
            obj[next[key]] ? '' : obj[next[key]] = true && prev.push(next);
        }
        return prev;
    }, []);
}

//菜单转换为树
const menuToTree = (menu = []) => {
    if (menu.length === 0) return [];
    let resultTree = [];
    //每个菜单加入children属性，将顶级菜单提取
    for (let item of menu) {
        item.children = [];
        if (!item.parent_id) {
            resultTree.push(item);
        }
    }
    //根据顶级菜单构建所属子菜单
    let maps = tree => {
        menu.filter(item => {
            if (item.parent_id == tree.id) {
                tree.children.push(item);
                maps(item);
            }
        })
    }
    //循环构建菜单树
    for (let item of resultTree) {
        maps(item);
    }
    return resultTree;
}

// // //上传文件
// const uploadFile = param => {
//     let file = ctx.request.files; // 获取上传文件
//     path.join(__dirname,'public/upload/')
//     let remotefilePath = `http://192.168.1.101:8090/upload` + `/${ctx.request.files['filesname']['name']}`;

//     console.log(file)

//     return ctx.body = {file};
//     // 创建可读流
//     // const reader = fs.createReadStream(ctx.request.files['filesname']['path']);
//     // let filePath = `public/upload` + `/${ctx.request.files['filesname']['name']}`;
//     // // let remotefilePath = `http://192.168.1.101:8090/upload` + `/${ctx.request.files['filesname']['name']}`;
//     // // 创建可写流
//     // const upStream = fs.createWriteStream(filePath);
//     // // 可读流通过管道写入可写流
//     // reader.pipe(upStream);
// }

//检测上传的文件夹是否存在，不存在要先创建
const checkDirExist = dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
const CURD = {

}
module.exports = {
    sendMail,
    errorMessage,
    successMessage,
    isEmptys,
    menuToTree,
    arrayRepeatForReduce,
    checkDirExist,
    CURD
}