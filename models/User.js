const {INTEGER, STRING} = require('sequelize');
const sequelize = require('../database/sequelize');

var User = sequelize.define('koa_user', {
    id: {
        type: INTEGER,
        // 允许为空
        allowNull: false,
        // 主键
        primaryKey: true,
        // 自增
        autoIncrement: true,
    },
    username: {
        type: STRING(100),
        comment: '账号'
    },
    password: {
        type: STRING(100),
        comment: '密码'
    },
    email: {
        type: STRING(100),
        comment: '邮箱'
    },
    name: {
        type: STRING(100),
        comment: '姓名'
    },
    mobile: {
        type: STRING(100),
        comment: '手机号'
    },
    head_thumb: {
        type: STRING(1000),
        comment: '头像'
    },
    bz: {
        type: STRING(100),
        comment: '备注'
    },
    del_marker: {
        type: INTEGER(2),
        defaultValue: 0,
        comment: '删除标记'
    }
});
module.exports = User;

//创建表，默认是false，true则是删除原有表，再创建
// User.sync({
//     force: true,
// });