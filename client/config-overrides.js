module.exports = function override(config, env) {
    // Override webpack config
    if (config.devServer) {
      config.devServer.setupMiddlewares = (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
  
        // Custom middleware logic if needed
        // Example: devServer.app.use((req, res, next) => {
        //   // Your custom middleware logic
        //   next();
        // });
  
        return middlewares;
      };
  
      // Remove deprecated options if they are set elsewhere
      delete config.devServer.onAfterSetupMiddleware;
      delete config.devServer.onBeforeSetupMiddleware;
    }
  
    return config;
  };
  