const Service = require("egg").Service;

class GameService extends Service {

  async nextLevelExp() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { nextLevel } = this.ctx.request.query;
    if (!nextLevel) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "nextLevel is required"
      }
      return;
    }
    const level = await mysql.get("levels", { Lv: nextLevel });
    if (level) {
      ctx.body = {
        success: true,
        dneedexp: level.exp
      }
    }else{
      ctx.body = {
        success: false,
        message: "No experience found for the specified level"
      }
    }
  }

  async getAttack() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { uboneid } = this.ctx.request.query;
    if (!uboneid) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Bone id is required"
      }
      return;
    }
    const bone = await mysql.get("bones", { bid: uboneid });
    if (bone) {
      ctx.body = {
        success: true,
        attack: bone.battack
      }
    }else{
      ctx.body = {
        success: false,
        message: "No bone found for the specified bone id"
      }
    }
  }

  async getRewards() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { id } = this.ctx.request.query;
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required"
      }
      return;
    }
    const rewards = await mysql.select("user_rewards", {
      columns: ["RewardType","RewardEvent","RewardSkull"],
      where: {uid: id},
      orders: [["time", "DESC"]],
      limit: 6
    });
    if (rewards) {
      ctx.body = {
        success: true,
        rewards
      }
    }else{
      ctx.body = {
        success: false,
        message: "Get rewards error"
      }
    }
  }

  async upLevel() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { id, nextLevel } = this.ctx.request.body;
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required"
      }
      return;
    }
    if (!nextLevel || typeof nextLevel !== "number") {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Next level id is required"
      }
      return;
    }
    // 获取升到此级时奖励的骷髅头数
    const level = await mysql.get("levels", { Lv: nextLevel });
    if (!level) {
      ctx.body = {
        success: false,
        message: "Get level update params failed"
      }
      return;
    }
    const addsSkull = level.skull;
    // 更新用户信息
    const user = await mysql.get("users", { uid: id });
    if (!user) {
      ctx.body = {
        success: false,
        message: "Invalid level id"
      }
      return;
    }
    const ulevel = user.ulevel + 1;
    const skull = user.skull + addsSkull;
    const userUpdate = {
      ulevel,
      skull
    }
    const result = await mysql.update("users", userUpdate, {
      where: {uid: id},
    });
    if (result.affectedRows !== 1){
      ctx.body = {
        success: false,
        message: "Update user info failed"
      }
      return;
    }
    // 新增用户升级奖励记录
    const insertReward = {
      uid: id,
      RewardType: 3,
      RewardEvent: "Upgrade",
      RewardSkull: addsSkull
    }
    const result2 = await mysql.insert("user_rewards", insertReward);
    if (result2.affectedRows !== 1){
      ctx.body = {
        success: false,
        message: "Insert user reward failed"
      }
      return;
    }
    ctx.body = {
      success: true,
      message: "Level up successfully",
      skull: addsSkull
    }
  }

  async getRewards() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { id } = this.ctx.request.query;
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required"
      }
      return;
    }
    const rewards = await mysql.select("user_rewards", {
      columns: ["RewardType","RewardEvent","RewardSkull"],
      where: {uid: id},
      orders: [["time", "DESC"]],
      limit: 6
    });
    if (rewards) {
      ctx.body = {
        success: true,
        rewards
      }
    }else{
      ctx.body = {
        success: false,
        message: "Get rewards error"
      }
    }
  }

  async doubleUp() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { id, nextLevel } = this.ctx.request.body;
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required"
      }
      return;
    }
    if (!nextLevel || typeof nextLevel !== "number") {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Next level id is required"
      }
      return;
    }
    // 获取升到此级时奖励的骷髅头数
    const level = await mysql.get("levels", { Lv: nextLevel-1 });
    if (!level) {
      ctx.body = {
        success: false,
        message: "Get level update params failed"
      }
      return;
    }
    const addsSkull = level.skull;
    // 更新用户信息
    const user = await mysql.get("users", { uid: id });
    if (!user) {
      ctx.body = {
        success: false,
        message: "Invalid level id"
      }
      return;
    }
    const skull = user.skull + addsSkull;
    const userUpdate = {
      skull
    }
    const result = await mysql.update("users", userUpdate, {
      where: {uid: id},
    });
    if (result.affectedRows !== 1){
      ctx.body = {
        success: false,
        message: "Update user info failed"
      }
      return;
    }
    // 新增用户升级奖励记录
    const insertReward = {
      uid: id,
      RewardType: 3,
      RewardEvent: "Upgrade",
      RewardSkull: addsSkull
    }
    const result2 = await mysql.insert("user_rewards", insertReward);
    if (result2.affectedRows !== 1){
      ctx.body = {
        success: false,
        message: "Insert user reward failed"
      }
      return;
    }
    ctx.body = {
      success: true,
      message: "Level up share successfully",
      skull: addsSkull
    }
  }

  async getRewards() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { id } = this.ctx.request.query;
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required"
      }
      return;
    }
    const rewards = await mysql.select("user_rewards", {
      columns: ["RewardType","RewardEvent","RewardSkull"],
      where: {uid: id},
      orders: [["time", "DESC"]],
      limit: 6
    });
    if (rewards) {
      ctx.body = {
        success: true,
        rewards
      }
    }else{
      ctx.body = {
        success: false,
        message: "Get rewards error"
      }
    }
  }

  async updateExp() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { id, exp } = this.ctx.request.body;
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required"
      }
      return;
    }
    if (!exp) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "exp is required"
      }
      return;
    }
    if (typeof exp !== "number" || exp < 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "exp must be a number and > 0"
      }
      return;
    }
    // 更新用户信息
    const user = await mysql.get("users", { uid: id });
    if (!user) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Invalid user id"
      }
      return;
    }
    const userUpdate = {
      uexp: user.uexp + exp,
    }
    const result = await mysql.update("users", userUpdate, {
      where: {uid: id},
    })
    if (result.affectedRows !== 1){
      ctx.body = {
        success: false,
        message: "Update user info failed"
      }
      return;
    }
    ctx.body = {
      success: true,
      message: "Update experience successfully"
    }
  }
}

module.exports = GameService;
