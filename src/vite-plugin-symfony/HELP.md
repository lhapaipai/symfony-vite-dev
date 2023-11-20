```js
import util from "node:util";

if (pluginOptions.debug) {
  setTimeout(() => {
    logger.info(`\n${colors.green("➜")}  Vite Config \n`);
    logger.info(util.inspect(viteConfig, { showHidden: false, depth: null, colors: true }));
    logger.info(`\n${colors.green("➜")}  End of config \n`);
  }, 100);
}
```