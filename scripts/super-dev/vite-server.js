import { createServer } from "vite";
import { _getPath } from "../utils.js";

export async function createViteServer() {
  const server = await createServer({
    root: _getPath("build-static-html"),
    configFile: _getPath("build-static-html/vite.config.js"),
    server: { port: 2570 },
  });

  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });

  return server;
}

export function triggerReload(server, fullReload, path) {
  if (fullReload) {
    server.ws.send({
      type: "full-reload",
      path: "*",
    });
    return;
  }
  let filePath = _getPath(path);
  // filePath 中的目录分隔符是 \\ ，要转成 / 才能和 modulelGraph 中的匹配上。
  filePath = filePath.replaceAll("\\", "/");
  // moduleGraph 包含请求过的模块。没有在浏览器中访问过的模块不在 moduleGraph 中。如果根本没打开过浏览器，则 moduleGraph 为空。
  const moduleSet = server.moduleGraph.getModulesByFile(filePath);
  // 如果没有访问过该模块，moduleSet 为 undefined。
  if (moduleSet) {
    moduleSet.forEach((module) => server.reloadModule(module));
  }
}
