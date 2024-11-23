const { Controller } = require("egg");

class DrumController extends Controller {
  async login() {
    const { ctx } = this;
    await ctx.service.drum.login();
  }
}

module.exports = DrumController;
