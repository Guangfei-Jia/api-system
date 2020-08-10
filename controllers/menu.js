const { Menu } = require('../model');                                  //全部实例模型
const { menu_val } = require('../validator');                                  //
const { errorMessage, successMessage, menuToTree } = require('../utils');

//添加菜单
const fn_add = async ctx => {
    let data = ctx.request.body;
    const {errors, isValid} = menu_val(data);
    if(!isValid){
        return ctx.body = errors;
    }
    try {
        const { name, parent_id, router_url, router_param, router_param_val, outer_url, router_type, icon_url, order  } = data;
        const create_user = ctx.state.user.user_id;
        await Menu.create({
            name, parent_id, router_url, router_param, router_param_val, outer_url, router_type, icon_url, order, create_user
        })
        return ctx.body = successMessage('添加成功');
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('添加失败');
    }
}

//修改菜单
const fn_update = async ctx => {
    let data = ctx.request.body;
    const {errors, isValid} = menu_val(data, true);
    if(!isValid){
        return ctx.body = errors;
    }
    try {
        const { id, name, router_url = '', router_param = '', router_param_val='', outer_url = '',router_type = 1, icon_url = '', order = 0  } = data;
        let result = await Menu.findOne({where: {id}});
        if(!result){
            return ctx.body = errorMessage('当前数据不存在!');
        }
        let updateResult = result.update({
            name, router_url, router_param, outer_url, icon_url, order, router_param_val, router_type,
            update_user: ctx.state.user.user_id
        })
        // result.name = data.name;
        // result.update_user = ctx.state.user.user_id;
        // await roles.save();
        return ctx.body = successMessage('修改成功！', updateResult);
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('修改失败');
    }
}

//删除菜单，单条或多条
/**
 * 遗留功能
 * 删除对应子菜单
 * 批量添加子菜单
 */
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
        result = await Menu.destroy({where: wheres});
        return ctx.body = successMessage('删除成功', {count: result});
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('删除失败');
    }
}

//查询整个菜单树
const fn_list = async ctx => {
    let result = await Menu.findAll( {
        // attributes: ['id', 'name', 'parent_id']
        order: [['order', 'asc']]
    });
    //将modle数据转换为json处理，生成菜单树
    result = JSON.parse(JSON.stringify(result));
    let resultTree = menuToTree(result);
    return ctx.body = successMessage('', resultTree);
}

module.exports = [
    {method: 'POST', path: '/menu/add', func: fn_add},
    {method: 'PUT', path: '/menu/update', func: fn_update},
    {method: 'DELETE', path: '/menu/delete/:id', func: fn_delete},
    {method: 'GET', path: '/menu/list', func: fn_list},
]