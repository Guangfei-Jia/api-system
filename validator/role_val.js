const { isEmpty, isLength } = require('validator');
const { errorMessage, isEmptys } = require('../utils');

module.exports = function validatorGoods(data) {
    let errors = {};

    data.name = !isEmptys(data.name) ? data.name + '' : '';

    if(isEmpty(data.name)){
        errors = errorMessage('角色名称必填！');
    }
    if(!isLength(data.name,{min:2,max:50})){
		errors = {
			code: -1,
			message: "名称的长度不能小于2位并且不能大于50位！"
		}
	}

    return{
		errors: errors,
		isValid: isEmptys(errors)           //写一个isEmpty方法，判断当前errors里面有没有内容
	};
}
