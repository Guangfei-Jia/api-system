const { Role, RoleUser } = require('../model');                                  //全部实例模型
const { role_user_val } = require('../validator');                                  //全部实例模型
const { errorMessage, successMessage } = require('../utils');

//为用户分配角色,批量删除后配置
const fn_add = async ctx => {
    let data = ctx.request.body;
    const {errors, isValid} = role_user_val(data);
    if(!isValid){
        return ctx.body = errors;
    }
    try {
        const { id, role_id } = data;
        //此处应该使用事务
        await RoleUser.destroy({ where: { user_id: id } }); 
        const createAll = role_id.map( item => {
            return item = {
                user_id: id,
                role_id: item
            }
        });
        const userRole = await RoleUser.bulkCreate(createAll)
        return ctx.body = successMessage('配置成功',{count: userRole.length});
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('配置失败');
    }
}

//查询用户对应全部角色
const fn_list = async ctx => {
    try {
        const { id } = ctx.request.query;
        RoleUser.belongsTo(Role,{foreignKey:'role_id'});

        let result = await RoleUser.findAll({
            where:{user_id: id},
            attributes: ['id', 'user_id', 'role_id', 'updatedAt'],
            include:[{
                model: Role,
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
    {method: 'POST', path: '/limit/role/add', func: fn_add},
    {method: 'GET', path: '/limit/role/list', func: fn_list},
]