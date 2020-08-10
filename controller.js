//扫描处理全部的controllers路由文件
const fs = require('fs');

//路由处理
function addMaping(router, method, path, func){
    switch(method){
        case 'GET':
            router.get(path, func);
            return;
        case 'POST':
            router.post(path, func);
            return;
        case 'PUT':
            router.put(path, func);
            return;
        case 'DELETE':
            router.del(path, func);
            return;
        default:
            console.log(`Invalid method: ${method} with path: ${path}`);
            return;
    }
}

//添加路由
function addControllers(router, dir) {
    var file = fs.readdirSync(__dirname + '/' +  dir);    //获取文件夹下面文件名称列表
    //筛选js文件
    var js_file = file.filter(item => {
        return item.endsWith('.js');
    })
    //遍历js文件数组
    for (let f of js_file) {
        let mapping = require(__dirname + '/' +  dir + '/' + f);
        //动态添加每一个路由
        mapping.forEach(mp => {
            addMaping(router, mp.method, mp.path, mp.func);
        });
    }
}

module.exports = function (dir) {
    let controller_dir = dir || 'controllers',     //默认遍历文件夹controllers
        router = require('koa-router')();           //引入router模块
    addControllers(router, controller_dir);
    return router.routes();
}