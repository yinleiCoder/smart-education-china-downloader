const http = require("./http");
const { getTchTreeLinks, getTchTreeDatas } = require("./requests/tchMaterial");
const { extractTchBook } = require("./requests/tchBookData");

async function Run() {
  const data = await getTchTreeLinks(http);
  const treeLinks = data["urls"].split(",");
  const bookDatas = await getTchTreeDatas(http, treeLinks);
  await extractTchBook(http, bookDatas);
}

/**
 * 1. 分析目标网站
 * 2. 抓网站数据包
 * 3. 构造网络请求
 * @author yinlei
 */
Run();
