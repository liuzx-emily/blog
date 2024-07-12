/* 
简单的 npm run a & npm run b 并不能让a，b并行。怀疑是 windows 系统不支持
简单写了个实现并行的方法，但是遇到新问题：
  通过脚本修改的文件，vite dev server 并不能监听到变化。放public里不相应变化（被缓存了），放public外面报错，因为js文件有timestamp后缀
所以有尝试新写法。每次监听到 post 变化。都重启 vite dev。但是还有新问题：
  vite会提示  port is in use trying another one。因为重启的时候，并不能保证前一个vite进程已经终止了。并没有找到类似 killed 的回调
*/

import child_process from "node:child_process";

let viteProcess;

// TODO 凑合解决了。但是速度慢，且vite会提示 port is in use trying another one
gerenateNewChildAndLogItsOutput("node build/index.js", () => {
  if (viteProcess) {
    viteProcess.kill();
    // kill后并不知道进程什么时候terminated
  }
  viteProcess = gerenateNewChildAndLogItsOutput("vite serve");
});
// gerenateNewChildAndLogItsOutput("vite serve");

function gerenateNewChildAndLogItsOutput(cmdstr, cb) {
  const child = child_process.exec(cmdstr);
  // You can also use a variable to save the output
  // for when the script closes later
  var scriptOutput = "";

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", function (data) {
    //Here is where the output goes

    console.log(data);

    data = data.toString();
    scriptOutput += data;
    cb && cb();
  });

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", function (data) {
    //Here is where the error output goes

    console.log("stderr: " + data);

    data = data.toString();
    scriptOutput += data;
  });

  child.on("close", function (code) {
    //Here you can get the exit code of the script

    console.log("closing code: " + code);

    console.log("Full output of script: ", scriptOutput);
  });
  return child;
}
