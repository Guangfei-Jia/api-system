const { isLength, isEmpty, isEmail } = require('validator');
const { isEmptys, errorMessage } = require('../utils');
//注册信息验证
module.exports = data => {         //传入的数据就是用户数据，用data进行接收
	let errors = {};  				//定义一个空对对象，如果条件判断错误，给对象赋予属性
	data.username = !isEmptys(data.username + "") ? data.username : "";
	data.password = !isEmptys(data.password + "") ? data.password : "";
	data.email = !isEmptys(data.email) ? data.email : "";
	data.mobile = !isEmptys(data.mobile) ? data.mobile : "";

	if (!isLength(data.username, { min: 2, max: 30 })) {
		errors = errorMessage('用户名的长度不能小于2位并且不能大于30位！');
	}
	if (isEmpty(data.username)) {
		errors = errorMessage('用户名不能为空！');
	}
	if (isEmpty(data.password)) {
		errors = errorMessage('用户名密码不能为空！不能为空！');
	}
	if (!isLength(data.password, { min: 6, max: 30 })) {
		errors = errorMessage('密码的长度不能小于6位并且不能大于30位！');
	}

	if (!isLength(data.mobile, { min: 11, max: 11 })) {
		errors = errorMessage('手机号格式不正确！');
	}

	if (!isEmail(data.email)) {
		errors = errorMessage('邮箱格式不正确！');
	}
	return {
		errors: errors,
		isValid: isEmptys(errors)           //写一个isEmpty方法，判断当前errors里面有没有内容
	};
}