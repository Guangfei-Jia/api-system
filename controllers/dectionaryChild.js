const { DectionaryChild } = require('../model');                                          //全部实例模型
const { dectionary_child_val } = require('../validator');                                  //全部实例模型
const { errorMessage, successMessage } = require('../utils');
//查询字典数据
const fn_list = async ctx => {
    const { parent_id = '', code = '', name = '', pageSize = 10, pageNum = 1 } = ctx.request.body,
        wheres = { del_marker: { $eq: 0 }, parent_id: { $eq: parent_id } };
    if (!parent_id) {
        return ctx.body = errorMessage('字典大类不存在');
    }
    if (code.trim() !== '') {
        wheres.code = { $substring: code.trim() };
    }
    if (name.trim() !== '') {
        wheres.name = { $substring: name.trim() };
    }
    let result = await DectionaryChild.findAndCountAll({
        limit: pageSize,
        offset: (pageNum - 1) * pageSize,
        where: wheres,
        order: [
            ['updatedAt', 'DESC'],
        ],
    });
    return ctx.body = successMessage('', result);
}
//新增字典数据
const fn_add = async ctx => {
    let data = ctx.request.body;
    const { errors, isValid } = dectionary_child_val(data);
    if (!isValid) {
        return ctx.body = errors;
    }
    try {
        const { parent_id, code, name, description } = data;
        await DectionaryChild.create({
            parent_id, code, name, description
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
    const { errors, isValid } = dectionary_child_val(data);
    if (!isValid) {
        return ctx.body = errors;
    }
    try {
        const { id } = data;
        if (!id) {
            return ctx.body = errorMessage('缺失主键id');
        }
        let dectionary = await DectionaryChild.findOne({ where: { id } });
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
    { method: 'POST', path: '/dectionaryChild/add', func: fn_add },
    { method: 'PUT', path: '/dectionaryChild/update', func: fn_update },
    // { method: 'DELETE', path: '/goods/delete', func: fn_delete },
    { method: 'POST', path: '/dectionaryChild/list', func: fn_list },
]