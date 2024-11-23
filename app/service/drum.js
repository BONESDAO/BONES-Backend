const Service = require("egg").Service;

class DrumService extends Service {
  // 返回已有用户信息或创建新用户
  async login() {
    const { ctx , app} = this;
    const { mysql } = app;
    const { id, username, uacceptcode } = this.ctx.request.body;
    // 校验ID
    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "ID is required"
      }
      return;
    }
    // 查询用户是否存在
    const user = await mysql.get("users", { uid: id });
    if (user) {
      ctx.body = {
        success: true,
        message: "User already exists",
        results: user
      }
      return;
    }
    // 用户不存在则创建用户
    if (uacceptcode) { // 用户是被邀请进来的
      // 寻找邀请此用户的用户
      const inviter = await mysql.get("users", { uinvitecode: uacceptcode });
      if (inviter) {
        // 奖励邀请人骷髅和攻击力升级
        const updateSkullSql = "UPDATE users SET skull = skull + 1161850,uboneid = CASE WHEN uboneid + 1 > 16 THEN 16 ELSE uboneid + 1 END WHERE uid = ?";
        await mysql.query(updateSkullSql, [inviter.uid]);
        // 新增邀请人奖励记录
        const insertShareReward = {
          uid: inviter.uid,
          RewardType: 2,
          RewardEvent: "Share",
          RewardSkull: 1161850
        }
        await mysql.insert("user_rewards", insertShareReward);
        // 创建用户
        await createUser(ctx, mysql, id, username, uacceptcode);
      }
    }else {
      // 创建用户
      await createUser(ctx, mysql, id, username, uacceptcode);
    }
  }
}

const createUser = async(ctx, mysql, id, username, uacceptcode) => {
  const uinvitecode = Math.random().toString(36).substring(2, 10).toUpperCase();
  if(!username) {
    username = "default";
  }
  // 创建用户
  const newUser = {
    uid: id,
    uname: username,
    uinvitecode,
    uacceptcode,
    skull: 521880
  }
  await mysql.insert("users", newUser);
  // 新增用户注册奖励记录
  const insertRegisterReward = {
    uid: id,
    RewardType: 1,
    RewardEvent: "Register",
    RewardSkull: 512880
  }
  await mysql.insert("user_rewards", insertRegisterReward);
  // 返回刚刚注册的用户信息
  const user = await mysql.get("users", { uid: id });
  if (user) {
    ctx.body = {
      success: true,
      message: "User created successfully",
      results: user
    }
  }else {
    ctx.body = {
      success: false,
      message: "User created failed",
    }
  }
}

module.exports = DrumService;
