const { Controller } = require("egg");

class TaskController extends Controller {
  async list() {
    const { ctx } = this;
    await ctx.service.task.list();
  }
  async complete() {
    const { ctx } = this;
    await ctx.service.task.complete();
  }
}

module.exports = TaskController;
