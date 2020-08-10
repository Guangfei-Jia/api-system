const Validator = require('validator');
const { isEmptys, errorMessage } = require('../utils');

 //登陆信息验证
module.exports = function validatorloginInput(data){
	let errors = {};
 
    data.username = !isEmptys(data.username) ? data.username : "";
    data.password = !isEmptys(data.password) ? data.password : "";
 
	if(Validator.isEmpty(data.username)){
		errors = errorMessage('用户名不能为空！');
	}
 
	// if(!Validator.isEmail(data.email)){
	// 	errors.email = "邮箱不合法！";
	// }
 
	if(Validator.isEmpty(data.password)){
		errors = errorMessage('密码不能为空！');
	}
 
	return{
		errors:errors,
		isValid:isEmptys(errors)
	};
}