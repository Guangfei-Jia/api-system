const { INTEGER, STRING } = require('sequelize');
const sequelize = require('../database/sequelize');

var Menu = sequelize.define('koa_menu', {
    id: {
        type: INTEGER,
        // 允许为空
        allowNull: false,
        // 主键
        primaryKey: true,
        // 自增
        autoIncrement: true,
    },
    name: {
        type: STRING(100),
        comment: '菜单名称',
        allowNull: false,
    },
    parent_id: {
        type: INTEGER,
        comment: '父菜单id'
    },
    router_url: {
        type: STRING(1000),
        comment: '路由url'
    },
    router_param: {
        type: STRING(100),
        comment: '路由参数名'
    },
    router_param_val: {
        type: STRING(100),
        comment: '路由参数值'
    },
    router_type: {
        type: INTEGER(10),
        comment: '路由类型（1:菜单；2:内页路由；3:按钮）'
    },
    outer_url: {
        type: STRING(1000),
        comment: '外部url，定义后路由url无效'
    },
    icon_url: {
        type: STRING(1000),
        comment: '图标'
    },
    order: {
        type: INTEGER(100),
        comment: '排序'
    },
    create_user: {
        type: STRING(100),
        comment: '创建者名称'
    },
    update_user: {
        type: STRING(100),
        comment: '更新者名称'
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
module.exports = Menu;

//创建表，默认是false，true则是删除原有表，再创建
// Menu.sync({
//     force: true,
// });