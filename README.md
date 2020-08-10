# management-system管理系统对应服务端
    开发语言：node.js
    数据库：mysql
    所用框架：ORM框架Sequelize 
    整体架构：模拟mvc开发模式，models模型、controllers业务实现、validator数据验证

## 目录文件介绍
    config          数据库配置、邮件发送配置、token签名秘钥和端口
    controlllers    业务逻辑实现模块，暴露路由和对应实现函数
    database        Sequelize连接数据库配置
    moduls          数据库模型控制模块
    public/upload   文件上传目录
    validator       数据、表单提交验证模块
    app.js          服务器入口文件
    controller.js   路由统一处理文件
    model.js        遍历输出全部模型
    validator.js    遍历输出全部验证文件
    utils.js        全局通用函数 

## 已实现功能点
    1、token登陆权限控制
    2、邮件发送
    3、文件上传
    4、登陆、注册、修改密码
    5、菜单管理、用户管理、个人信息设置
    6、未封装的 websocket 模块

## 运行步骤
    1、

## 注意事项

# 数据库常用ORM操作参考
## 新增
// 方法1：build后对象只存在于内存中，调用save后才操作db
var user = User.build({
    'emp_id': '1',
    'nick': '小红',
    'department': '技术部'
});
user = yield user.save();
console.log(user.get({'plain': true}));

// 方法2：直接操作db
var user = yield User.create({
    'emp_id': '2',
    'nick': '小明',
    'department': '技术部'
});
console.log(user.get({'plain': true}));

## 修改
// 方法1：操作对象属性（不会操作db），调用save后操作db
user.nick = '小白';
user = yield user.save();
console.log(user.get({'plain': true}));

// 方法2：直接update操作db
user = yield user.update({
    'nick': '小白白'
});
console.log(user.get({'plain': true}));

白名单更新
// 方法1
user.emp_id = '33';
user.nick = '小白';
user = yield user.save({'fields': ['nick']});

// 方法2
user = yield user.update(
    {'emp_id': '33', 'nick': '小白'},
    {'fields': ['nick']}
});
这样就只会更新nick字段，而emp_id会被忽略。这种方法在对表单提交过来的一大推数据中只更新某些属性的时候比较有用
## 删除
yield user.destroy();

# 查看
## 查看全部
var users = yield User.findAll();
## 查看部分,重命名
var users = yield User.findAll({
    'attributes': ['emp_id', 'nick', ['rename', 'names']]
});
## 条件
var users = yield User.findAll({
    'where': {
        'id': [1, 2, 3], //in操作
        'nick': 'a',
        'department': null  //is null 操作
    }
});
## where
var users = yield User.findAll({
    'where': {
        'id': {
            '$eq': 1,                // id = 1
            '$ne': 2,                // id != 2

            '$gt': 6,                // id > 6
            '$gte': 6,               // id >= 6

            '$lt': 10,               // id < 10
            '$lte': 10,              // id <= 10

            '$between': [6, 10],     // id BETWEEN 6 AND 10
            '$notBetween': [11, 15], // id NOT BETWEEN 11 AND 15

            '$in': [1, 2],           // id IN (1, 2)
            '$notIn': [3, 4]         // id NOT IN (3, 4)
        },
        'nick': {
            '$like': '%a%',          // nick LIKE '%a%'
            '$notLike': '%a'         // nick NOT LIKE '%a'
        },
        'updated_at': {
            '$eq': null,             // updated_at IS NULL
            '$ne': null              // created_at IS NOT NULL
        }
    }
});
## or
var users = yield User.findAll({
    'where': {
        '$or': [
            {'id': [1, 2]},
            {'nick': null}
        ]
    }
});
## order
var users = yield User.findAll({
    'order': [
        ['id', 'DESC'],
        ['nick']
    ]
});
## 查一条数据
user = yield User.findById(1);

user = yield User.findOne({
    'where': {'nick': 'a'}
});
## 查询并获取数量
var result = yield User.findAndCountAll({
    'limit': 20,
    'offset': 0
});
console.log(result);
方法会执行2个SQL，返回的result对象将包含2个字段：result.count是数据总数，result.rows是符合查询条件的所有数据
SELECT count(*) AS `count` FROM `users` AS `user`;  //会携带where条件
SELECT `id`, `emp_id`, `nick`, `department`, `created_at`, `updated_at` 
FROM `users` AS `user` 
LIMIT 20;
## 批量插入
var users = yield User.bulkCreate(
    [
        {'emp_id': 'a', 'nick': 'a'},
        {'emp_id': 'b', 'nick': 'b'},
        {'emp_id': 'c', 'nick': 'c'}
    ]
);
## 批量修改
var affectedRows = yield User.update(
    {'nick': 'hhhh'},
    {
        'where': {
            'id': [2, 3, 4]
        }
    }
);