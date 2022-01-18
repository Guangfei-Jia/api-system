const { User, Menu, RoleMenu, RoleUser } = require('../model');                         //实例模型
const { pub_login, pub_token } = require('../validator');                               //登录静态验证
const { menuToTree, successMessage, errorMessage, arrayRepeatForReduce } = require("../utils");       //通用模块
const bcrypt = require('bcryptjs');                                           //密码加密解密模块 
const tokenExp = '2h';                                                                  //accessToken过期时间 2小时
const refreshTokenExp = '7d';                                                           //refreshToken过期时间
const tokenExpDouble = 2 * 2 * 60 * 60;                                                 //2倍的accessToken过期时间间隔,2小时

//登陆
const fn_login = async ctx => {
    const { errors, isValid } = pub_login(ctx.request.body);
    //判断ifValid是否通过
    if (!isValid) {
        return ctx.body = errors;
    }
    //此处通过email查询数据库中用户信息，验证加密密码后使用信息生成token
    let { username, password } = ctx.request.body;
    try {
        //用户操作可以封装
        let user = await User.findOne({
            where: { username }
        })
        if (!user) {
            return ctx.body = errorMessage('当前用户不存在!');
        }
        //验证密码
        const result = bcrypt.compareSync(password, user.password);
        if (!result) {
            return ctx.body = errorMessage('密码错误!');
        }
        //token参数
        const payload = {
            username,
            user_id: user.id,
            user_name: user.name
        };
        //此处生成token需要封装
        const accessToken = await pub_token.setToken(payload, tokenExp);
        const refreshToken = await pub_token.setToken(payload, refreshTokenExp);
        //用来获取accessToken过期时间参数
        const varAccessToken = await pub_token.verToken('Bearer ' + accessToken);
        if (accessToken == null || refreshToken == null) {
            return ctx.body = errorMessage('token生成失败!');
        }
        //此处可以缓存当前登录用户 refreshToken 创建的起始时间，这个会在刷新accessToken方法中 判断是否要重新生成(刷新)refreshToken时用到
        //更新用户最近登录时间
        let data = {
            tokens: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                tokenType: 'Bearer',
                accessTokenExp: varAccessToken.exp
            },
            userInfo: {
                username: user.username,
                name: user.name,
                userId: user.id,
            }
        };
        return ctx.body = successMessage('登陆成功', data);
    } catch (error) {
        console.log(error);
    }
}

//刷新accessToken、refreshToken
const fn_refreshAccessToken = async ctx => {
    //请求刷新的时候先判断上次的token是否真正过期了，真正过期不再刷新，返回401重新登陆

    //解析refreshToken获取用户信息、refreshToken过期时间
    const varRefreshToken = await pub_token.verToken(ctx.request.body.refreshToken);
    const payload = {
        username: varRefreshToken.username,
        user_id: varRefreshToken.user_id,
        user_name: varRefreshToken.user_name
    }
    //生成新的accessToken
    const newAccessToken = await pub_token.setToken(payload, tokenExp);
    //解析新token，用于获取过期时间
    const varAccessToken = await pub_token.verToken('Bearer ' + newAccessToken);
    if (newAccessToken == null) {
        return ctx.body = errorMessage('token生成失败!');
    }
    //当前时间，单位s
    const thisTime = (new Date().getTime()) / 1000;
    const data = {
        accessToken: newAccessToken,
        accessTokenExp: varAccessToken.exp
    }
    //refreshToken过期时间间隔小于2倍的accessToken过期时间
    if ((varRefreshToken.exp - thisTime) < tokenExpDouble) {
        //生成新的refreshToken
        const newFreshToken = await pub_token.setToken(payload, refreshTokenExp);
        data.refreshToken = newFreshToken;
    }
    return ctx.body = successMessage('token刷新成功', data);
}

//获取当前登陆用户的菜单树
const fn_userMenu = async ctx => {
    //查询整个菜单树
    RoleUser.belongsTo(RoleMenu, { targetKey: 'role_id', foreignKey: 'role_id' });
    RoleMenu.belongsTo(Menu, { foreignKey: 'menu_id' })
    let result = await RoleUser.findAll({
        attributes: ['id', 'role_id', 'user_id'],
        include: [{
            model: RoleMenu,
            attributes: ['id', 'role_id', 'menu_id'],
            include: [{
                model: Menu
            }]
        }],
        where: { user_id: ctx.state.user.user_id },
        order: [[RoleMenu, Menu, 'order', 'asc']]
        // order:[[RoleMenu, Menu, 'id', 'asc']]
    });
    /**
     * 将modle数据转换为json，处理json，只需要menu部分
     * arrayRepeatForReduce进行menu去重
     * menuToTree将最终menu转换为树返回
     */
    result = menuToTree(arrayRepeatForReduce(
        JSON.parse(JSON.stringify(result)).map(item => {
            if (item.koa_role_menu) {
                return item = item.koa_role_menu.koa_menu;
            }
        }),
        'id'
    ));    //去重并转换树
    return ctx.body = successMessage('', result);
}

//文件上传
const fn_uploadFile = async ctx => {
    let file = ctx.request.files; // 获取上传文件
    filenameArray = file.file.path.split('/');
    let filename = ctx.href + '/' + filenameArray[filenameArray.length - 1];
    return ctx.body = successMessage('上传成功', filename);
}

//首页
const fn_index = async ctx => {
    return ctx.body = successMessage('首页成功', [
        { id: 1, name: 'jia' },
        { id: 2, name: 'guang' }
    ]);
}

module.exports = [
    { method: 'GET', path: '/home', func: fn_index },
    { method: 'POST', path: '/login', func: fn_login },
    { method: 'POST', path: '/refreshAccessToken', func: fn_refreshAccessToken },
    { method: 'GET', path: '/userMenuList', func: fn_userMenu },
    { method: 'POST', path: '/upload', func: fn_uploadFile },

]