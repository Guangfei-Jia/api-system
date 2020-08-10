//连接mysql数据库
const Sequelize = require("sequelize");
const config_db = require('../config/config_db');
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $startsWith: Op.startsWith,
  $endsWith: Op.endsWith,
  $substring: Op.substring,
  $and: Op.and,
  $or: Op.or,
  $col: Op.col,
  $literal: Sequelize.literal,
};
const mysqlConfig ={
    host: config_db.host,   //  接数据库的主机
    port: config_db.port,   //  接数据库的端口
    protocol: 'tcp',        //  连接数据库使用的协议
    dialect: 'mysql',       //  使用mysql
    dialectOptions: {       //  转换查询结果中时间格式为yyyy-mm-dd hh:mm:ss
      dateStrings: true,
      typeCast: true
    },
    pool: { 
        max: 5,             //  最大连接数量
        min: 0,             //  最小连接数量
        idle: 30000         //  连接空置时间（毫秒），超时后将释放连接
    },
    logging: true,         //  设置后不会自动打印控制台日志
    retry: {                //  设置自动查询时的重试标志
        max: 3              //  设置重试次数
    },
    omitNull: false,        //  null 是否通过SQL语句查询
    timezone: '+08:00',     //  解决时差 - 默认存储时间存在8小时误差
    sync: { alter: true },  //  sequelize.sync的默认选项
    define: {               //  模型表通用的定义,停止所有模型行为
        underscored: false, //  所有属性添加下带划线的字段
        freezeTableName: true, //  默认false，表名称为复数，true不更改表名称
        charset: 'utf8',    //  模型表字符集
        dialectOptions: {  
          collate: 'utf8_general_ci'
        },
        timestamps: true    //模型添加createdAt和updatedAt时间戳
      },
      operatorsAliases
    // isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ    //默认事务隔离级别
    // dialectOptions: {
    //     socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    //     supportBigNumbers: true,
    //     bigNumberStrings: true
    // },
};
const sequelize = new Sequelize(config_db.database, config_db.username, config_db.password, mysqlConfig);
// sequelize.sync();   //  开启以后，同步全部模型到数据库
module.exports = sequelize;