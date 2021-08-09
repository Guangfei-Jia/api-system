const { User } = require('../model');                                       //全部实例模型
const { sendMail, errorMessage, successMessage } = require('../utils');
const { pub_register, pub_updataPassword, pub_sendMail, pub_updateUser } = require('../validator'); 
const bcrypt = require('bcrypt');                                           //密码加密解密模块 
const saltRounds = 10;                                                      //密码加密级别

//注册（添加用户）
const fn_register = async ctx => {
    const {errors, isValid} = pub_register(ctx.request.body); 
    //判断ifValid是否通过验证
    if(!isValid){
        return ctx.body = errors;
    }
    const {username = '', password = '', email = ''} = ctx.request.body;
    try {
        let user = await User.findOne({
            where: { username }
        });
        if(user){
            return ctx.body = errorMessage('当前用户已存在!');
        }
        //密码hash加密
        const salt = bcrypt.genSaltSync(saltRounds);
        const newPassword = bcrypt.hashSync(password, salt);
        await User.create({
            username: username,
            password: newPassword,
            email: email
        });
        return ctx.body = successMessage('注册成功');
    } catch (error) {
        console.log(error);
    }
}

//修改密码
const fn_updatePassword = async ctx => {
    const {errors, isValid} = pub_updataPassword(ctx.request.body);
    if(!isValid){
        return ctx.body = errors;
    }
    let {username, password, newPassword} = ctx.request.body;
    
    try {
        let user = await User.findOne({where: {username}});
        if(!user){
            return ctx.body = errorMessage('当前用户不存在!');
        }
        //验证密码
        const result = bcrypt.compareSync(password, user.password);
        if(!result){
            return ctx.body = errorMessage('原密码错误!');
        }
        //密码hash加密
        const salt = bcrypt.genSaltSync(saltRounds);
        const newPass = bcrypt.hashSync(newPassword, salt);
        user.password = newPass;
        await user.save();
        // //方法2 await user.update({ password });
        // //方法3 User.update({ password:newPass }, {where:{ username }})
        return ctx.body = successMessage('密码修改成功!');
    } catch (error) {
        console.log(error);
    }
}

//通过密保邮箱找回密码，发送邮件
const fn_sendMail = async ctx => {
    const {errors, isValid} = pub_sendMail(ctx.request.body);
    if(!isValid){
        return ctx.body = errors;
    }
    let { username, email } = ctx.request.body;
    try {
        let user = await User.findOne({where: {username}});
        if(!user){
            return ctx.body = errorMessage('当前用户不存在!');
        }
        //验证邮箱
        if(!(user.email === email)){
            return ctx.body = errorMessage('邮箱不正确!');
        }
        try {
            await sendMail(user); //发送邮件
            
            //重置为初始密码
            const salt = bcrypt.genSaltSync(saltRounds);
            const newPass = bcrypt.hashSync("Qwer@1234", salt);
            user.password = newPass;
            await user.save();
            return ctx.body = successMessage('密码已重置，请进入邮箱查看！');
        } catch (error) {
            return ctx.body = errorMessage('邮件发送失败!');
        }
    } catch (error) {
        console.log(error);
    }
}

//修改用户信息
const fn_updateSelf = async ctx => {
    const { id, email = '', name = '', mobile = '', head_thumb = ''  } = ctx.request.body;
    let user = await User.findOne({ where: { id } });
    if(!user){
        return ctx.body = errorMessage('当前数据不存在!');
    }
    let updateResult = await user.update({
        email, name, mobile, head_thumb
    })
    return ctx.body = successMessage('修改成功！', updateResult);
}

//查询用户信息
const fn_detailSelf = async ctx => {
    const { id } = ctx.params;
    let user = await User.findOne({ 
        where: { id },
        attributes: [ 'email', 'name', 'mobile', 'head_thumb', 'bz']
    });
    if(!user){
        return ctx.body = errorMessage('当前用户不存在!');
    }
    return ctx.body = successMessage('成功', user);
}

//管理员--删除角色，单条或多条
//人员标可以改为标记删除，防止误操作
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
        result = await User.destroy({where: wheres});
        return ctx.body = successMessage('删除成功', {count: result});
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('删除失败');
    }
}

//管理员--分页条件查询用户
const fn_list = async ctx => {
    const { name = '', pageSize = 10, pageNum = 1 } = ctx.request.body;
    let wheres = {};
    //用户姓名查询
    if(name.trim() !== ''){
        wheres.name = {$substring: name.trim()};
    }
    //普通分页
    let result = await User.findAndCountAll( {
        attributes: ['id', 'name', 'username', 'mobile', 'email', 'bz', 'head_thumb', 'updatedAt'], 
        where: wheres,
        limit: pageSize, 
        offset: (pageNum - 1) * pageSize
    });
    ctx.body = successMessage('', result);
}

//管理员--修改账号信息
const fn_update = async ctx => {
    const {errors, isValid} = pub_updateUser(ctx.request.body); 
    //判断ifValid是否通过验证
    if(!isValid){
        return ctx.body = errors;
    }
    const { id, email = '', name = '', mobile = '', bz = ''  } = ctx.request.body;
    let user = await User.findOne({ where: { id } });
    if(!user){
        return ctx.body = errorMessage('当前数据不存在!');
    }
    let updateResult = await user.update({
        email, name, mobile, bz
    })
    return ctx.body = successMessage('修改成功！', updateResult);
}

module.exports = [
    {method: 'POST', path: '/register', func: fn_register},
    {method: 'POST', path: '/updatePassword', func: fn_updatePassword},
    {method: 'POST', path: '/sendMail', func: fn_sendMail},
    {method: 'DELETE', path: '/user/delete/:id', func: fn_delete},
    {method: 'POST', path: '/user/list', func: fn_list},
    {method: 'PUT', path: '/user/updateSelf', func: fn_updateSelf},
    {method: 'PUT', path: '/user/update', func: fn_update},
    {method: 'GET', path: '/user/detail/:id', func: fn_detailSelf},
]