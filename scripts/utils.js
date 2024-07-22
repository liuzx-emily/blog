import path from "node:path";
import process from "process";
import Showdown from "showdown";
import ShowdownHighlight from "showdown-highlight";

export function _getPath(str) {
  return path.join(process.cwd(), str);
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

export function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

export function createConverter() {
  const converter = new Showdown.Converter({
    tables: true,
    disableForced4SpacesIndentedSublists: true,
    extensions: [
      ShowdownHighlight({
        pre: true, // Whether to add the classes to the <pre> tag, default is false
        auto_detection: true, // Whether to use hljs' auto language detection, default is true
      }),
    ],
  });
  return converter;
}
