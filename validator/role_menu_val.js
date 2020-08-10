const { isEmpty } = require('validator');
const { isEmptys, errorMessage } = require('../utils');

//角色用户关联验证
module.exports = function validatorloginInput(data){
    let errors = {},                                            //定义一个空对对象，如果条件判断错误，给对象赋予属性
		dataKey = ['role_id', 'menu_ids'];
    for(let key of dataKey){
        data[key] = Array.isArray(data[key]) ? data[key] : (!isEmptys(data[key]) ? data[key]+'' : '')
    }
	if(isEmpty(data.role_id)){
		errors = errorMessage('角色id不能为空！');
    }
	if(!Array.isArray(data.menu_ids)){
		errors = errorMessage('菜单类型错误！');
	}
 
	return{
		errors:errors,
		isValid:isEmptys(errors)
	};
}