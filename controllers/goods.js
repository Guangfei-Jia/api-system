const { Goods } = require('../model');                                          //全部实例模型
const { goods_val } = require('../validator');                                  //全部实例模型
const { errorMessage, successMessage } = require('../utils');

//添加产品
const fn_add = async ctx => {
    let data = ctx.request.body;
    const {errors, isValid} = goods_val(data);
    if(!isValid){
        return ctx.body = errors;
    }
    try {
        const {name, introduce, price, pre_price, num} = data;
        await Goods.create({
            name, introduce, price, pre_price, num
        })
        return ctx.body = successMessage('添加成功');
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('添加失败');
    }
}

//修改产品
const fn_update = async ctx => {
    let data = ctx.request.body;
    const {errors, isValid} = goods_val(data);
    if(!isValid){
        return ctx.body = errors;
    }
    try {
        const { id } = ctx.params;
        let goods = await Goods.findOne({where: {id}});
        if(!goods){
            return ctx.body = errorMessage('当前数据不存在!');
        }
        for(let [key, val] of Object.entries(data)){
            goods[key] = val;
        }
        await goods.save();
        return ctx.body = successMessage('修改成功！');
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('修改失败');
    }
}

//删除产品，单条或多条
const fn_delete = async ctx => {
    const { id } = ctx.params;
    try {
        let idArray = id.split(',').map((item) => { return item = parseInt(item)}),
            result = 0,
            wheres = { id: id };
        if(idArray.length > 1){
            //批量删除条件控制
            wheres = { id: {$in:idArray} };
        }
        result = await Goods.destroy({where: wheres});
        return ctx.body = successMessage('删除成功', {count: result});
    } catch (error) {
        console.log(error);
        return ctx.body = errorMessage('删除失败');
    }
}

//分页条件查询商品
const fn_list = async ctx => {
    const { name = '', pricePre = '', priceEnd = '', timeStart = '', timeEnd = ''} = ctx.request.body,
          wheres = {};
    //产品名称查询
    if(name.trim() !== ''){
        wheres.name = {$substring: name.trim()};
    }
    //价格范围查询
    if(pricePre !== '' || priceEnd !== ''){
        wheres.price = {};
    }
    if(pricePre !== ''){
        wheres.price['$gte'] = pricePre;
    }
    if(priceEnd !== ''){
        wheres.price['$lte'] = priceEnd;
    }
    //更新日期范围查询
    if(timeStart !== '' || timeEnd !== ''){
        wheres.updatedAt = {};
    }
    if(timeStart !== ''){
        wheres.updatedAt['$gte'] = timeStart;
    }
    if(timeEnd !== ''){
        wheres.updatedAt['$lte'] = timeEnd;
    }
    let result = await Goods.findAll({where: wheres});
    return ctx.body = successMessage('',result);
}

module.exports = [
    {method: 'POST', path: '/goods/add', func: fn_add},
    {method: 'PUT', path: '/goods/update/:id', func: fn_update},
    {method: 'DELETE', path: '/goods/delete/:id', func: fn_delete},
    {method: 'POST', path: '/goods/list', func: fn_list},
]