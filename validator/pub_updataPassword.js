const { isEmpty, isLength, equals } = require('validator');
const { isEmptys, errorMessage } = require('../utils');

module.exports = function validatorUpdataPassword(data){         //传入的数据就是用户数据，用data进行接收
	let errors = {},                                            //定义一个空对对象，如果条件判断错误，给对象赋予属性
        dataKey = ['username', 'password', 'newPassword', 'reNewPassword'];
    for(let key of dataKey){
        data[key] = !isEmptys(data[key]) ? data[key] + '' : ''
	}
	
    if(isEmpty(data.username)){
		errors = errorMessage('用户名不能为空！');
    }
    if(isEmpty(data.password)){
		errors = errorMessage('密码不能为空！');
    }
	if(!isLength(data.newPassword,{min:6,max:30})){
		errors = errorMessage('密码的长度不能小于6位并且不能大于30位！');
    }
	if(isEmpty(data.newPassword)){
		errors = errorMessage('确认密码不能为空！');
	}
	if(!equals(data.newPassword,data.reNewPassword)){
		errors = errorMessage('两次密码不一致！');
	}
	
    return{
		errors:errors,
		isValid:isEmptys(errors)           //写一个isEmpty方法，判断当前errors里面有没有内容
	};
}