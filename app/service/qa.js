const Service = require("egg").Service;

class QaService extends Service {
  async list() {
    const { ctx, app } = this;
    const { mysql } = app;
    const { id } = this.ctx.request.query;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required",
      };
      return;
    }

    const sql =
      "SELECT q.qid, q.question, q.answer, q.rewards, (SELECT COUNT(*) FROM user_have_qa h WHERE h.uid = ? and h.qid = q.qid) completed FROM qa q";
    const result = await mysql.query(sql, [id]);

    if (!result) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Get qa failed",
      };
      return;
    }

    ctx.body = {
      success: true,
      qatasks: result,
    };
  }

  async complete() {
    const { ctx, app } = this;
    const { mysql } = app;
    const { id, qid, skull, isCorrect } = this.ctx.request.body;

    console.log(id);
    console.log(qid);
    console.log(skull);
    console.log(isCorrect);

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "User id is required",
      };
      return;
    }

    if (!qid) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Qa id is required",
      };
      return;
    }

    if (!skull || typeof skull !== "number" || skull <= 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Invalid skull number",
      };
      return;
    }

    // 插入用户答题完成表
    const haveTaskSql = "INSERT INTO `user_have_qa` (uid, qid, timestamp) VALUES (?, ?, NOW())";
    const result = await mysql.query(haveTaskSql, [id, qid]);
    if (result.affectedRows !== 1) {
      ctx.body = {
        success: false,
        message: "Update user qa completed failed"
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
    const newSkull = user.skull;
    if(isCorrect) {
      newSkull = skull + user.skull;
    } else {
      newSkull = user.skull;
    }
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
        RewardType: 5,
        RewardEvent: "QA",
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
        message: "Qa completed successfully"
      }
  }
}

module.exports = QaService;
