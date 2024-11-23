const Service = require("egg").Service;

class RankService extends Service {
  async ranking() {
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

    // 查询用户本身信息和排名
    const sql = `SELECT u.uid, u.skull, u.uname, (SELECT COUNT(*)  FROM users WHERE skull >= u.skull) AS ranking FROM users u WHERE uid = ?`;
    const user = await mysql.query(sql, [id]);
    if (!user || user.length !== 1) {
      ctx.body = {
        success: false,
        message: "Invalid level id"
      }
      return;
    }
    // 查询骷髅数量前20名的用户
    const top20= await mysql.select("users", {
      columns: ["uid","uname","skull","uexp"],
      orders: [["skull", "DESC"]],
      limit: 20
    });
    if (!top20) {
      ctx.body = {
        success: false,
        message: "Get ranking failed"
      }
      return;
    }
    ctx.body = {
      success: true,
      top20,
      user: user[0]
    }
  }
  async getUserCount() {
    const { ctx , app} = this;
    const { mysql } = app;

    const userCount = await mysql.count("users");
    if (!userCount) {
      ctx.body = {
        success: false,
        message: "Get user count failed"
      }
      return;
    }
    ctx.body = {
      success: true,
      userCount
    }
  }
}

module.exports = RankService;
