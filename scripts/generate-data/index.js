import commandLineArgs from "command-line-args";
import {
  generateDataCategories,
  generateDataPosts,
  gererateAssets,
} from "./generate-data-helpers.js";

const args = commandLineArgs([{ name: "draft", type: Boolean }]);

async function run() {
  await generateDataCategories();
  await generateDataPosts({ includeDrafts: args.draft });
  await gererateAssets();
}

try {
  run();
} catch (e) {
  console.error(e);
  // eslint-disable-next-line no-debugger
  debugger;
}
