/* 扫描所有的model模型 */
const fs = require("fs");

//同步遍历目录
let files = fs.readdirSync(__dirname + '/validator');     

//文件内筛选js文件
let js_files = files.filter((f) => {
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    //User.js ==> name : User
    let name = f.substring(0, f.length - 3);     
    module.exports[name] = require(__dirname + "/validator/" + f);
}