const { INTEGER, STRING } = require('sequelize');
const sequelize = require('../database/sequelize');

var DectionaryChild = sequelize.define('koa_dictionary_child', {
    id: {
        type: INTEGER,
        // 允许为空
        allowNull: false,
        // 主键
        primaryKey: true,
        // 自增
        autoIncrement: true,
    },
    parent_id: {
        type: INTEGER,
        comment: '字典大类id',
        allowNull: false,
    },
    code: {
        type: STRING(100),
        comment: '字典数据代码',
        allowNull: false,
    },
    name: {
        type: STRING(100),
        comment: '字典数据名称',
        allowNull: false,
    },
    description: {
        type: STRING(200),
        comment: '字典数据描述',
    },
    if_effect: {
        type: INTEGER(2),
        defaultValue: 0,
        comment: '是否有效'
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
module.exports = DectionaryChild;
//创建表，默认是false，true则是删除原有表，再创建
// DectionaryChild.sync({
//     force: true,
// });