const { DectionaryChild, Dectionary } = require('../model');                                          //全部实例模型
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
        let dectionary = await Dectionary.findOne({ where: { id: parent_id } });
        if (!dectionary) {
            return ctx.body = errorMessage('字典大类不存在!');
        }
        const ifHas = await DectionaryChild.findOne({
            'where': { $and: [{ parent_id }, { $or: [{ name }, { code }] }] }
        });
        if (ifHas) {
            return ctx.body = errorMessage('数据编码或数据名称不可重复！');
        }
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
        const { id, parent_id, name, code } = data;
        if (!id) {
            return ctx.body = errorMessage('缺失主键id');
        }
        let dectionary = await DectionaryChild.findOne({ where: { id } });
        if (!dectionary) {
            return ctx.body = errorMessage('当前数据不存在!');
        }
        const ifHas = await DectionaryChild.findOne({
            'where': { $and: [{ parent_id }, { id: { '$ne': id } }, { $or: [{ name }, { code }] }] }
        });//修改时判断除去本身id: { '$ne': id } }
        if (ifHas) {
            return ctx.body = errorMessage('数据编码或数据名称不可重复！');
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
const fn_delete = async ctx => {
    try {
        const { id } = ctx.request.query;
        let idArray = id.split(',').map((item) => { return item = parseInt(item) }),
            result = 0,
            wheres = { id: id };
        if (idArray.length > 1) {
            //批量删除条件控制
            wheres = { id: { $in: idArray } };
        }
        result = await DectionaryChild.destroy({ where: wheres });
        return ctx.body = successMessage('删除成功', { count: result });
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('删除失败');
    }
}
module.exports = [
    { method: 'POST', path: '/dectionaryChild/add', func: fn_add },
    { method: 'PUT', path: '/dectionaryChild/update', func: fn_update },
    { method: 'DELETE', path: '/dectionaryChild/delete', func: fn_delete },
    { method: 'POST', path: '/dectionaryChild/list', func: fn_list },
]