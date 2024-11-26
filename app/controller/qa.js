const { Controller } = require("egg");

class QaController extends Controller {
  async list() {
    const { ctx } = this;
    await ctx.service.qa.list();
  }
  async complete() {
    const { ctx } = this;
    await ctx.service.qa.complete();
  }
}

module.exports = QaController;