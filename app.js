const Koa = require('koa');                         //koa2中导入的是一个class，所以首字母大写
// const bodyParser = require('koa-bodyparser');    //解析post请求，已经使用koaBody代替
const controller = require('./controller');         //引入api路由配置模块
const koa_jwt = require('koa-jwt')                  //token验证过滤模块
const koaBody = require('koa-body');                //文件上传处理
const cors = require('koa2-cors');                  //跨域处理模块
const config_sign = require('./config/config_sign');//token签名秘钥，请求验证时使用
const { pub_token } = require('./validator');       //token解析模块
const app = new Koa();                              //创建koa对象表示实例，以下是实例属性，可以传递给构造函数
const path = require('path');                       //路径解析模块
const serve = require("koa-static")                 //静态资源服务，指定对外提供访问的根目录
const { checkDirExist } = require('./utils');       //检测当前文件夹是否存在
const NO_USE_PATH = [/\/upload/,'/login', '/register', '/sendMail', '/refreshAccessToken']; //除了匹配的地址，其他的URL都需要验证token

//中间件，获取接口执行的时间
app.use(async (ctx,next) =>{
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    console.log(ms);
})

//中间件，验证token
app.use(async(ctx, next)=> {
    //获取authorization请求头
    var token = ctx.headers.authorization;
    if(token == undefined){
        await next();
    }else{
        //存储当前登陆人的信息
        const data = await pub_token.verToken(token);
        ctx.state = {
            data:data
        };
        await next();
    }
})

//登陆过期处理
app.use(async(ctx, next)=>{
    return next().catch((err) => {
        if (401 == err.status) {
            // ctx.status = 201;，状态码可自定义
            ctx.body = {
                code: 4010,
                message: '登录过期，请重新登录'
            }
        } else {
            throw err;
        }
    });
});

//请求身份拦截
app.use(koa_jwt({
	secret: config_sign.secretKey
}).unless({
	path: NO_USE_PATH
}));
//文件上传处理
app.use(koaBody({
  multipart:true, // 支持多文件上传  是否支持 multipart-formdate 的表单
//   encoding:'gzip',
  formidable:{
    uploadDir: path.join(__dirname,'public/upload/'), // 设置文件上传目录,首先检测目录是否存在
    keepExtensions: true,    // 保持文件的后缀 默认 false
    maxFields: 1000,    //限制字段的数量	默认	1000
    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小 默认 2 * 1024 * 1024
    // hash:false,                    //如果要计算文件的 hash，则可以选择 md5/sha1	String	false
    // multipart:true                       //是否支持多文件上传	Boolean	true
    onFileBegin:(name, file) => { // 文件上传前的设置，重命名处理操作等
        checkDirExist(path.join(__dirname,'public/'));
        checkDirExist(path.join(__dirname,'public/upload/'));
    //   app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
    //   app.context.uploadpath[name] = file.path;
    //   const fileFormat = file.name.split('.');
    //   file.name = `${Date.now()}.${fileFormat[fileFormat.length-1]}`
    //   file.path = `upload/${file.name}`;
    },
  }
}));
// 静态资源服务，指定对外提供访问的根目录
app.use(serve(path.join(__dirname, '/public')));

app.use(cors());                                //跨域处理引入,必须在路由前使用
// app.use(bodyParser());                          //post参数解析必须在路由之前注册到app，已经使用koaBody代替
app.use(controller());                          //路由必须在中间件后面，中间件才生效

let server = app.listen(config_sign.PORT); 
console.log('app started at port 8090...');

/** 
 * websocket模块 可正常使用，待完善和提取模块
*/
// const WebSocket = require('ws');
// const WebSocketServer = WebSocket.Server;
// const wss = new WebSocketServer(
//     {server:server}
// );
// wss.on('connection', function(ws){
//     ws.on('message', function(message){
//         var data = JSON.parse(message);
//         console.log(data);
//         switch (data.type) {
//             case 'join':
//                 ws.nickname = data.name;
//                 sendMessage(createMessage('join', '', data.name + ' 加入房间'));
//                 sendMessage(createMessage('userList', getAllChater(),''));
//                 break;
//             case 'message':
//                 let userdata = {
//                     name: data.name,
//                     message: data.message
//                 }
//                 sendMessage(createMessage('message', '',userdata));
//                 break;
//             default:
//                 break;
//         }
//     });
//     ws.on('close',function(){
//         sendMessage(createMessage('join', '', ws.nickname + ' 离开房间'));
//         sendMessage(createMessage('userList', getAllChater(),''));
//     });
//     ws.on('error',function(erro){
//         console.log(error);
//     })
// })
// var messageIndex = 0;
// function createMessage(type, userList, data) {
//     messageIndex ++;
//     return JSON.stringify({
//         id: messageIndex,
//         type: type,
//         userList: userList,
//         data: data
//     });
// }
// function sendMessage(msg){
//     wss.clients.forEach(function each(client) {
//         //全部广播
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(msg);
//         }
//         // //除自己以外广播
//         // if (client !== ws && client.readyState === WebSocket.OPEN) {
//         //     client.send(data);
//         // }
//     });
// }

// //全部的用户
// function getAllChater(){
//     var allChater = [];
//     wss.clients.forEach(function each(client) {
//         if (client.readyState === WebSocket.OPEN) {
//             let dt = {
//                 name: client.nickname,
//                 sex: 1
//             }
//             allChater.push(dt);
//         }
//     });
//     return JSON.stringify(allChater);
// }