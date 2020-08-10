const { isEmpty, isLength, isNumber, isInteger } = require('validator');
const { errorMessage, isEmptys } = require('../utils');

module.exports = function validatorGoods(data) {
    let errors = {},
        dataKey = ['name', 'introduce', 'price', 'num'];
    for(let key of dataKey){
        data[key] = !isEmptys(data[key]) ? data[key] + '' : ''
    }
    if(isEmpty(data.name)){
        errors = errorMessage('名称必填！');
    }
    if(isEmpty(data.introduce)){
        errors = errorMessage('简介必填！');
    }
    if(isEmpty(data.price)){
        errors = errorMessage('价格必填！');
    }
    if(isEmpty(data.num)){
        errors = errorMessage('库存必填！');
    }
    if(!isLength(data.username,{min:2,max:50})){
        errors = errorMessage('名称的长度不能小于2位并且不能大于50位！');
    }
    if(!isLength(data.username,{min:2,max:500})){
        errors = errorMessage('简介的长度不能小于2位并且不能大于500位！');
    }
    if(isNumber(data.price)){
        errors = errorMessage('价格格式输入有误！');
    }
    if(isInteger(data.num)){
        errors = errorMessage('库存格式输入有误！');
    }
    return{
		errors: errors,
		isValid: isEmptys(errors)           //写一个isEmpty方法，判断当前errors里面有没有内容
	};
}
