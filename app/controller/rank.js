const { Controller } = require("egg");

class RankController extends Controller {
  async ranking() {
    const { ctx } = this;
    await ctx.service.rank.ranking();
  }
  async getUserCount() {
    const { ctx } = this;
    await ctx.service.rank.getUserCount();
  }
}

module.exports = RankController;

