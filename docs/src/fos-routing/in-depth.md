# In-Depth

The idea behind this plugin is simple and follows the following workflow:

1. The plugin will watch for changes in your PHP files when you are starting vite.
2. When a PHP file changes, the plugin will run the `fos:js-routing:dump` command.
3. The plugin will then inject the generated routes in your JavaScript files at build time.
4. If there are new routes, the plugin will initiate a full reload in HMR.

That's it!
