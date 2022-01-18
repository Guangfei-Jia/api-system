const { INTEGER, STRING } = require('sequelize');
const sequelize = require('../database/sequelize');

var Dectionary = sequelize.define('koa_dictionary', {
    id: {
        type: INTEGER,
        // 允许为空
        allowNull: false,
        // 主键
        primaryKey: true,
        // 自增
        autoIncrement: true,
    },
    code: {
        type: STRING(100),
        comment: '字典代码',
        allowNull: false,
    },
    name: {
        type: STRING(100),
        comment: '字典名称',
        allowNull: false,
    },
    description: {
        type: STRING(200),
        comment: '字典描述',
    },
    bz: {
        type: STRING(100),
        comment: '备注'
    },
    bz1: {
        type: STRING(100),
        comment: '备注'
    },
    del_marker: {
        type: INTEGER(2),
        defaultValue: 0,
        comment: '删除标记'
    },
    create_user: {
        type: STRING(100),
        comment: '创建者名称'
    },
    update_user: {
        type: STRING(100),
        comment: '更新者名称'
    },
});
module.exports = Dectionary;
//创建表，默认是false，true则是删除原有表，再创建
// Dectionary.sync({
//     force: true,
// });