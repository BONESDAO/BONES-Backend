/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "toptap";

  // add your middleware config here
  config.middleware = ["errorHandler", "notfoundHandler"];

  // 配置允许跨域
  config.cors = {
    origin: "*",
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH"
  };

  // Mysql
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: "xxx.xxx.xxx.xxx",
      // 端口号
      port: "0",
      // 用户名
      user: "xxx",
      // 密码
      password: "xxx",
      // 数据库名
      database: "xxx"
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  //missing csrf toke  不设置的会保持，临时使用，为了安全正式使用请设置true
  //CSRF是为了防止攻击，在发起请求前要在header里设置 x-csrf-token。x-csrf-token的值要后端取
  config.security = {
    csrf:{
      enable:false
    },
    domainWhiteList: ["*"]
  };

  // config/config.${env}.js
  exports.logger = {
    dir: "./logs",
    level: "error", // 仅输出异常日志到文件，减少对服务器磁盘空间的占用
    consoleLevel: 'debug',
  };

  // if any files need rotate by file size, config here
  exports.logrotator = {
    maxDays: 1,       // 每天生成一个新文件
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
