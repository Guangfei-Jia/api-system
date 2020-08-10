const { isEmpty, isEmail } = require('validator');
const { isEmptys, errorMessage } = require('../utils');

module.exports = function validatorUpdataPassword(data){         //传入的数据就是用户数据，用data进行接收
    let errors = {};                                            //定义一个空对对象，如果条件判断错误，给对象赋予属性
	
	data.username = !isEmptys(data.username) ? data.username : "";
	data.email = !isEmptys(data.email) ? data.email : "";
	
    if(isEmpty(data.username)){
		errors = errorMessage('用户名不能为空！');
    }
    if(!isEmail(data.email)){
		errors = errorMessage('邮箱格式不正确！');
    }
    return{
		errors:errors,
		isValid:isEmptys(errors)           //写一个isEmpty方法，判断当前errors里面有没有内容
	};
}