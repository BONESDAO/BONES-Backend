/**
 * @param {Egg.Application} app - egg application
 */

const ROOT_URL = "/api";
module.exports = app => {
  const { router, controller } = app;

  // 用户存在则返回用户信息，不存在则创建用户
  router.post(ROOT_URL + "/login", controller.drum.login);

  // 获取升级所需经验值
  router.get(ROOT_URL + "/game/getNextLevelExp", controller.game.nextLevelExp);
  // 根据骨头棒子ID获取攻击力
  router.get(ROOT_URL + "/game/getAttack", controller.game.getAttack);
  // 获取用户的最新6个奖励记录
  router.get(ROOT_URL + "/game/getRewards", controller.game.getRewards);
  // 用户升级
  router.post(ROOT_URL + "/game/upLevel", controller.game.upLevel);
  // 用户升级分享以后再次奖励骷髅
  router.post(ROOT_URL + "/game/doubleUp", controller.game.doubleUp);
  // 用户增加经验
  router.post(ROOT_URL + "/game/updateExp", controller.game.updateExp);

  // 获取用户排行信息
  router.get(ROOT_URL + "/rank/ranking", controller.rank.ranking);
  // 获取用户的总数量
  router.get(ROOT_URL + "/rank/getUserCount", controller.rank.getUserCount);

  // 获取用户任务列表以及完成进度
  router.get(ROOT_URL + "/task/list", controller.task.list);
  // 用户完成任务
  router.post(ROOT_URL + "/task/complete", controller.task.complete);

  // 获取答题列表
  router.get(ROOT_URL + "/qa/list", controller.qa.list);
  // 用户提交答案
  router.post(ROOT_URL + "/qa/complete", controller.qa.complete);

  // 获取该验证码邀请过的用户
  router.get(ROOT_URL + "/invite/getInvitedUsers", controller.invite.getInvitedUsers);
};
