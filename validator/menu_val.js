const { isEmpty, isLength } = require('validator');
const { errorMessage, isEmptys } = require('../utils');

module.exports = function validatorMenu(data, isEdit = false) {
    let errors = {},
        dataKey = ['id', 'name', 'router_url', 'router_param', 'outer_url'];
    for(let key of dataKey){
        data[key] = !isEmptys(data[key]) ? data[key] + '' : ''
    }
    if(isEmpty(data.name)){
        errors = errorMessage('名称必填！');
    }
    if(!isLength(data.name,{min:2,max:20})){
        errors = errorMessage('名称的长度不能小于2位并且不能大于20位！');
    }
    if(isEmpty(data.router_url) && isEmpty(data.outer_url)){
        errors = errorMessage('路由地址和外链地址不能同时为空！');
    }
    if(data.router_url.includes(':') && isEmpty(data.router_param)){
        errors = errorMessage('动态路由必须填写参数！');
    }
    if(isEdit){
        if(isEmpty(data.id)){
            errors = errorMessage('编辑必须传递数据id！');
        }
    }
    return{
		errors: errors,
		isValid: isEmptys(errors)           //写一个isEmpty方法，判断当前errors里面有没有内容
	};
}
