const {INTEGER, STRING} = require('sequelize');
const sequelize = require('../database/sequelize');

var Role = sequelize.define('koa_role', {
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
        comment: '角色名称',
        allowNull: false,
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
module.exports = Role;

//创建表，默认是false，true则是删除原有表，再创建
// Role.sync({
//     force: true,
// });