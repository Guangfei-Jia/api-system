const { STRING, DECIMAL, INTEGER } = require('sequelize');
const sequelize = require('../database/sequelize');

var Goods = sequelize.define('koa_goods', {
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
        comment: '产品名称'
    },
    introduce: {
        type: STRING(1000),
        comment: '产品简介'
    },
    price: {
        type: DECIMAL(9, 2),
        comment: '产品当前价格'
    },
    pre_price: {
        type: DECIMAL(9, 2),
        comment: '产品原始价格价格'
    },
    num: {
        type: INTEGER,
        comment: '库存'
    },
    bz: {
        type: STRING(100),
        comment: '备注'
    },
});
module.exports = Goods;

//创建表，默认是false，true则是删除原有表，再创建
// Goods.sync({
//     force: true,
// });