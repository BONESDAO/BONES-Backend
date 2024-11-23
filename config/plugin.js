/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mysql: {
    enable: true,
    package: "egg-mysql",
  },

  cors: {
    enable: true,
    package: "egg-cors",
  },

  logrotator: { // 日志自动分割
    enable: true,
    package: "egg-logrotator"
  }

};
