module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next();
    if (ctx.status === 404 && !ctx.body) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        code: 404,
        message: "Not Found"
      };
    }
  };
};
