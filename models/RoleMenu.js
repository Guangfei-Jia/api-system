const {INTEGER} = require('sequelize');
const sequelize = require('../database/sequelize');

var RoleMenu = sequelize.define('koa_role_menu', {
    id: {
        type: INTEGER,
        // 允许为空
        allowNull: false,
        // 主键
        primaryKey: true,
        // 自增
        autoIncrement: true,
    },
    role_id: {
        type: INTEGER,
        comment: '角色id',
        allowNull: false,
    },
    menu_id: {
        type: INTEGER,
        comment: '菜单id',
        allowNull: false,
    },
});
module.exports = RoleMenu;

//创建表，默认是false，true则是删除原有表，再创建
// RoleMenu.sync({
//     force: true,
// });