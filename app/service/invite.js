const Service = require("egg").Service;

class InviteService extends Service {
  async getInvitedUsers() {
    const { ctx, app } = this;
    const { mysql } = app;
    const { inviteCode } = this.ctx.request.query;

    if (!inviteCode) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Invite code is required"
      }
      return;
    }
     const invitedUsers = await mysql.select("users", {
       columns: ["uid", "uname"],
       where: { uacceptcode: inviteCode }
     })
    if (!invitedUsers) {
      ctx.body = {
        success: false,
        message: "Get invited users failed"
      }
      return;
    }
    ctx.body = {
      success: true,
      invitedUsers
    }
  }
}

module.exports = InviteService;
