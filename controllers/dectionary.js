const { Dectionary } = require('../model');                                          //全部实例模型
const { dectionary_val } = require('../validator');                                  //全部实例模型
const { errorMessage, successMessage } = require('../utils');
//查询字典
const fn_list = async ctx => {
    const { code = '', name = '', pageSize = 10, pageNum = 1 } = ctx.request.body,
        wheres = { del_marker: { $eq: 0 } };
    //产品名称查询
    if (code.trim() !== '') {
        wheres.code = { $substring: code.trim() };
    }
    if (name.trim() !== '') {
        wheres.name = { $substring: name.trim() };
    }
    let result = await Dectionary.findAndCountAll({
        limit: pageSize,
        offset: (pageNum - 1) * pageSize,
        where: wheres,
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    return ctx.body = successMessage('', result);
}
//新增字典
const fn_add = async ctx => {
    let data = ctx.request.body;
    const { errors, isValid } = dectionary_val(data);
    if (!isValid) {
        return ctx.body = errors;
    }
    try {
        const { code, name, description } = data;
        await Dectionary.create({
            code, name, description
        })
        return ctx.body = successMessage('添加成功');
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('添加失败');
    }
}
//修改字典
const fn_update = async ctx => {
    let data = ctx.request.body;
    const { errors, isValid } = dectionary_val(data);
    if (!isValid) {
        return ctx.body = errors;
    }
    try {
        const { id } = data;
        let dectionary = await Dectionary.findOne({ where: { id } });
        if (!dectionary) {
            return ctx.body = errorMessage('当前数据不存在!');
        }
        for (let [key, val] of Object.entries(data)) {
            dectionary[key] = val;
        }
        await dectionary.save();
        return ctx.body = successMessage('修改成功！');
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('修改失败');
    }
}
module.exports = [
    { method: 'POST', path: '/dectionary/add', func: fn_add },
    { method: 'PUT', path: '/dectionary/update', func: fn_update },
    // { method: 'DELETE', path: '/goods/delete', func: fn_delete },
    { method: 'POST', path: '/dectionary/list', func: fn_list },
]