const { Controller } = require("egg");

class GameController extends Controller {
  async nextLevelExp() {
    const { ctx } = this;
    await ctx.service.game.nextLevelExp();
  }
  async getAttack() {
    const { ctx } = this;
    await ctx.service.game.getAttack();
  }
  async getRewards() {
    const { ctx } = this;
    await ctx.service.game.getRewards();
  }
  async upLevel() {
    const { ctx } = this;
    await ctx.service.game.upLevel();
  }
  async updateExp() {
    const { ctx } = this;
    await ctx.service.game.updateExp();
  }
  async doubleUp() {
    const { ctx } = this;
    await ctx.service.game.doubleUp();
  }
}

module.exports = GameController;
