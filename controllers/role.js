const { Role } = require('../model');                                  //全部实例模型
const { role_val } = require('../validator');                                  //全部实例模型
const { errorMessage, successMessage } = require('../utils');

//添加角色
const fn_add = async ctx => {
    let data = ctx.request.body;
    const {errors, isValid} = role_val(data);
    if(!isValid){
        return ctx.body = errors;
    }
    try {
        const { name } = data;
        const create_user = ctx.state.user.user_id;
        await Role.create({
            name, create_user
        })
        return ctx.body = successMessage('添加成功');
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('添加失败');
    }
}

//修改角色
const fn_update = async ctx => {
    let data = ctx.request.body;
    const {errors, isValid} = role_val(data);
    if(!isValid){
        return ctx.body = errors;
    }
    try {
        const { id, name } = data;
        let roles = await Role.findOne({where: {id}});
        if(!roles){
            return ctx.body = errorMessage('当前数据不存在!');
        }
        roles.name = name;
        roles.update_user = ctx.state.user.user_id;
        await roles.save();
        return ctx.body = successMessage('修改成功！');
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('修改失败');
    }
}

//删除角色，单条或多条
const fn_delete = async ctx => {
    try {
        const { id } = ctx.params,
              idArray = id.split(',').map((item) => { return item = parseInt(item)});
        let result = 0,
            wheres = { id: id };
        if(idArray.length > 1){
            //批量删除条件控制
            wheres = { id: {$in:idArray} };
        }
        result = await Role.destroy({where: wheres});
        if(!result){
            return ctx.body = errorMessage('删除失败');
        }
        return ctx.body = successMessage('删除成功', {count: result});
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('删除失败');
    }
}

//分页条件查询角色
const fn_list = async ctx => {
    const { name = '', pageSize = 10, pageNum = 1 } = ctx.request.body;
    let wheres = {};
    //产品名称查询
    if(name.trim() !== ''){
        wheres.name = {$substring: name.trim()};
    }
    let obj = {
        attributes: ['id', 'name', 'create_user', 'update_user', 'updatedAt'], 
        where: wheres,
        order: [['updatedAt', 'desc']],
    }
    if(pageNum !== -1){
        //普通分页
        obj = Object.assign({}, obj, {
            limit: pageSize, 
            offset: (pageNum - 1) * pageSize
        })
    }
    let result = await Role.findAndCountAll( obj );
    // //根据索引查询id 万级数量级查询优化 
    // let resultId = await Role.findAndCountAll({attributes: ['id'], limit: 1, offset: (pageNum - 1) * pageSize });
    // wheres.id = { $gte: resultId.rows[0].id};
    // //分页优化查询
    // let data = await Role.findAll( {
    //     attributes: ['id', 'name', 'create_user', 'update_user', 'updatedAt'], 
    //     where: wheres,
    //     limit: pageSize
    // });
    // let result = {
    //     count: resultId.count,
    //     rows: data
    // }

    return ctx.body = successMessage('请求成功', result);
}

module.exports = [
    {method: 'POST', path: '/role/add', func: fn_add},
    {method: 'PUT', path: '/role/update', func: fn_update},
    {method: 'DELETE', path: '/role/delete/:id', func: fn_delete},
    {method: 'POST', path: '/role/list', func: fn_list},
]