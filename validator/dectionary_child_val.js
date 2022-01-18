const { isEmpty } = require('validator');
const { errorMessage, isEmptys } = require('../utils');

module.exports = (data) => {
    let errors = {},
        dataKey = ['code', 'name', 'parent_id'];
    for (let key of dataKey) {
        data[key] = !isEmptys(data[key]) ? data[key] + '' : ''
    }
    if (isEmpty(data.parent_id)) {
        errors = errorMessage('字典大类必填！');
    }
    if (isEmpty(data.code)) {
        errors = errorMessage('字典编码必填！');
    }
    if (isEmpty(data.name)) {
        errors = errorMessage('字典名称必填！');
    }
    return {
        errors: errors,
        isValid: isEmptys(errors)           //写一个isEmpty方法，判断当前errors里面有没有内容
    };
}
