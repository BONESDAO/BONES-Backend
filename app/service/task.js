const Service = require("egg").Service;

class TaskService extends Service {
  async list() {
    const { ctx, app } = this;
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

    const sql = "SELECT t.tid, t.title, t.details, t.rewards, t.url, (SELECT COUNT(*) FROM user_have_tasks h WHERE h.uid = ? and h.tid = t.tid) completed FROM tasks t";
    const result = await mysql.query(sql, [id]);

    if (!result) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Get tasks failed"
      }
      return;
    }

    ctx.body = {
      success: true,
      tasks: result
    }

  }

  async complete() {
    const { ctx, app } = this;
    const { mysql } = app;
    const { id, tid, skull } = this.ctx.request.body;

    console.log(id);
    console.log(tid);
    console.log(skull);

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required"
      }
      return;
    }

    if (!tid) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Task id is required"
      }
      return;
    }

    if (!skull || typeof skull !== "number" || skull <= 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Invalid skull number"
      }
      return;
    }

    // 插入用户任务完成表
    const haveTaskSql = "INSERT INTO `user_have_tasks` (uid, tid, timestamp) VALUES (?, ?, NOW())";
    const result = await mysql.query(haveTaskSql, [id, tid]);
    if (result.affectedRows !== 1) {
      ctx.body = {
        success: false,
        message: "Update user task completed failed"
      }
      return;
    }

    // 增加用户骷髅数
    const user = await mysql.get("users", { uid: id });
    if (!user) {
      ctx.body = {
        success: false,
        message: "Invalid level id"
      }
      return;
    }
    const newSkull = skull + user.skull;
    const userUpdate = {
      skull: newSkull
    }
    const result2 = await mysql.update("users", userUpdate, {
      where: {uid: id}
    })
    if (result2.affectedRows !== 1) {
      ctx.body = {
        success: false,
        message: "Update user skull failed"
      }
      return;
    }

    // 插入用户奖励记录
    const insertReward = {
      uid: id,
      RewardType: 4,
      RewardEvent: "Task",
      RewardSkull: skull
    }
    const result3 = await mysql.insert("user_rewards", insertReward);
    if (result3.affectedRows !== 1) {
      ctx.body = {
        success: false,
        message: "Insert user reward record failed"
      }
      return;
    }

    ctx.body = {
      success: true,
      message: "Task completed successfully"
    }
  }
}

module.exports = TaskService;
