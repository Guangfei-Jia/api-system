const {INTEGER} = require('sequelize');
const sequelize = require('../database/sequelize');

var RoleUser = sequelize.define('koa_role_user', {
    id: {
        type: INTEGER,
        // 允许为空
        allowNull: false,
        // 主键
        primaryKey: true,
        // 自增
        autoIncrement: true,
    },
    
    user_id: {
        type: INTEGER,
        comment: '用户id',
        allowNull: false,
    },
    role_id: {
        type: INTEGER,
        comment: '角色id',
        allowNull: false,
    },
});
module.exports = RoleUser;

//创建表，默认是false，true则是删除原有表，再创建
// RoleUser.sync({
//     force: true,
// });