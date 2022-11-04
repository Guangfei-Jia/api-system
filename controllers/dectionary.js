const { Dectionary, DectionaryChild } = require('../model');                                          //全部实例模型
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
        const ifHas = await Dectionary.findOne({
            'where': { $or: [{ name }, { code }] }
        });
        if (ifHas) {
            return ctx.body = errorMessage('字典编码或字典名称不可重复！');
        }
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
        const { id, name, code } = data;
        let dectionary = await Dectionary.findOne({ where: { id } });
        if (!dectionary) {
            return ctx.body = errorMessage('当前数据不存在!');
        }
        const ifHas = await Dectionary.findOne({
            'where': { $and: [{ id: { '$ne': id } }, { $or: [{ name }, { code }] }] }
        });//修改时判断除去本身id: { '$ne': id } }
        if (ifHas) {
            return ctx.body = errorMessage('字典编码或字典名称不可重复！');
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
        const { id } = ctx.request.query,
            idArray = id.split(',').map((item) => { return item = parseInt(item) });
        let result = 0,
            wheres = { id: id },
            wheresChild = { parent_id: id };
        // if (idArray.length > 1) {
        //     //批量删除条件控制 
        //     wheres = { id: { $in: idArray } };
        //     wheresRole = { menu_id: { $in: idArray } }
        // }
        result = await Dectionary.destroy({ where: wheres });           //删除字典大类
        DectionaryChild.destroy({ where: wheresChild });                //同时删除字典配置

        //         let childMenu = await Menu.findAll({
        //             attributes: ['id'],
        //             where: { parent_id: id },
        //         });
        return ctx.body = successMessage('删除成功', { count: result });
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('删除失败');
    }
}
module.exports = [
    { method: 'POST', path: '/dectionary/add', func: fn_add },
    { method: 'PUT', path: '/dectionary/update', func: fn_update },
    { method: 'DELETE', path: '/dectionary/delete', func: fn_delete },
    { method: 'POST', path: '/dectionary/list', func: fn_list },
]