const { isLength, isEmpty, isEmail } = require('validator');
const { isEmptys, errorMessage } = require('../utils');
 //注册信息验证
module.exports = data => {         //传入的数据就是用户数据，用data进行接收
	let errors = {};  				//定义一个空对对象，如果条件判断错误，给对象赋予属性
	data.id = !isEmptys(data.id + "") ? data.id : "";
	data.email = !isEmptys(data.email) ? data.email : "";
	data.mobile = !isEmptys(data.mobile) ? data.mobile : "";

    if(!isLength(data.mobile,{min:11,max:11})){
		errors = errorMessage('手机号格式不正确！');
	}
	if(isEmpty(data.id + '')){
		errors = errorMessage('请传入需要修改的数据id！');
	}
	if(!isEmail(data.email)){
		errors = errorMessage('邮箱格式不正确！');
	}
	return{
		errors:errors,
		isValid:isEmptys(errors)           //写一个isEmpty方法，判断当前errors里面有没有内容
	};
}