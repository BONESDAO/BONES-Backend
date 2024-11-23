const { Controller } = require("egg");

class InviteController extends Controller {
  async getInvitedUsers() {
    const { ctx } = this;
    await ctx.service.invite.getInvitedUsers();
  }
}

module.exports = InviteController;
