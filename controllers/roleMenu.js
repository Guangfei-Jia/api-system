const { Menu, RoleMenu } = require('../model');                                  //全部实例模型
const { role_menu_val } = require('../validator');                                  //全部实例模型
const { errorMessage, successMessage } = require('../utils');

//为角色分配菜单,批量删除后配置
const fn_add = async ctx => {
    let data = ctx.request.body;
    const {errors, isValid} = role_menu_val(data);
    if(!isValid){
        return ctx.body = errors;
    }
    try {
        const { menu_ids, role_id } = data;
        //挂起，此处需要使用事务，首先删除角色对应的全部菜单，再重新授权
        await RoleMenu.destroy({ where: { role_id } }); 
        const createAll = menu_ids.map( item => {
            return item = {
                role_id,
                menu_id: item
            }
        });
        const menuRole = await RoleMenu.bulkCreate(createAll)
        return ctx.body = successMessage('配置成功',{count: menuRole.length});
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('配置失败');
    }
}

//查询角色对应菜单
const fn_list = async ctx => {
    try {
        const { id } = ctx.params;
        RoleMenu.belongsTo(Menu,{foreignKey:'menu_id'});

        let result = await RoleMenu.findAll({
            attributes: ['id', 'role_id', 'menu_id', 'updatedAt'],
            where: { role_id: id },
            include:[{
                model: Menu,
                attributes: [ 'name' ]
            }]
        })
        return ctx.body = successMessage('', result);
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('查询失败');
    }
}

module.exports = [
    {method: 'POST', path: '/limit/menu/add', func: fn_add},
    {method: 'GET', path: '/limit/menu/list/:id', func: fn_list},
]