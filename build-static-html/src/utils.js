// fmt yyyy-MM-dd hh:mm:ss.S
export function dateFormat(date, fmt) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度`
    S: date.getMilliseconds(), //毫秒
    "Z+": "UTC+" + (0 - date.getTimezoneOffset() / 60),
  };

  var week = {
    0: "/u65e5",
    1: "/u4e00",
    2: "/u4e8c",
    3: "/u4e09",
    4: "/u56db",
    5: "/u4e94",
    6: "/u516d",
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") +
        week[date.getDay() + ""]
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

export function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function walkThroughTree(treeArr, cb) {
  for (let i = 0; i < treeArr.length; i++) {
    const element = treeArr[i];
    cb(element);
    if (element?.children?.length > 0) {
      walkThroughTree(element.children, cb);
    }
  }
}
