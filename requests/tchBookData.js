const fs = require("fs");
const path = require("path");
const process = require("process");
const progressBar = require("progress");
const logger = require("../logger");

const { tchMaterialFile, bookStorageFolder } = require("../constants");

/**
 * Nodejs通过Axios下载单个电子教材并显示下载进度
 * @param {*} http
 * @param {*} book
 * @returns
 */
const downloadSingleBook = async (http, book, currentIndex, totalIndex) => {
  const bookStoragePath = path.resolve(
    process.cwd(),
    bookStorageFolder,
    `${book.title}.${book.format}`
  );
  let res = null;
  try {
    res = await http({
      url: tchMaterialFile(book.id),
      method: "get",
      responseType: "stream",
    });
  } catch (error) {
    logger.error(error);
    res = await http({
      url: tchMaterialFile(book.id, true),
      method: "get",
      responseType: "stream",
    });
  }
  // content-length是由服务端提供的响应头
  const totalFileSize = parseInt(res.headers["content-length"], 10);

  const progress = new progressBar(
    `(${currentIndex + 1}/${totalIndex}) ${
      book.title
    } downloading [:bar] :current/:total(byte) :elapsed(s) :percent`,
    {
      complete: "=",
      incomplete: " ",
      width: 50,
      total: totalFileSize,
    }
  );

  const writer = fs.createWriteStream(bookStoragePath);
  res.data.on("data", (chunk) => progress.tick(chunk.length));
  res.data.on("end", () => {
    console.log(
      `下载结束(${currentIndex + 1}/${totalIndex}) ${book.id} ${
        book.size
      } ${book.tags.map((tag) => tag.tag_name).join("/")} ${bookStoragePath}`
    );
    console.log("\n");
  });
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

/**
 * 根据书籍列表的ID进行下载文件
 * {
  id: 'bdc00134-465d-454b-a541-dcd0cec4d86e',
  title: '（根据2022年版课程标准修订）义务教育教科书·道德与法治一年级上册',
  resolution: '696*983',
  size: '44.25 MB',
  format: 'pdf',
  thumbnail: 'https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets/assets_document.t/zh-CN/1725007091740/transcode/image/1.jpg?v=1725014003021',
  create_time: '2022年9月29日 17:56:54',
  update_time: '2024年8月31日 17:44:58',
  tags: [
    {
      tag_id: '2cbuPWM3oXGSBI80OFKOSa',
      tag_name: '教材',
      tag_dimension_id: 'tagView',
      order_num: 196
    },
    {
      tag_id: 'ac92c18a-58c8-41da-86a5-f44afe3a90f7',
      tag_name: '电子教材',
      tag_dimension_id: '5036342742',
      order_num: 0
    },
    {
      tag_id: 'dfb9da8a-2ae2-4b2e-a733-687e0252443f',
      tag_name: '小学',
      tag_dimension_id: '5036342742',
      order_num: 0
    },
    {
      tag_id: '8c9f2e5c-e403-4f55-812c-289021ac66a0',
      tag_name: '道德与法治',
      tag_dimension_id: '5036342742',
      order_num: 0
    },
    {
      tag_id: '9d7edc22-dfc0-4653-95a5-cbe7e4908755',
      tag_name: '统编版',
      tag_dimension_id: '5036342742',
      order_num: 0
    },
    {
      tag_id: '0e4e66fc-ae0b-451e-9a91-9b7d86c0752e',
      tag_name: '一年级',
      tag_dimension_id: '5036342742',
      order_num: 0
    },
    {
      tag_id: '86d2dd1b-aa96-4f21-ab49-4d5bfc01029d',
      tag_name: '上册',
      tag_dimension_id: '5036342742',
      order_num: 0
    }
  ]
}
 * @param {*} http
 * @param {*} bookDatas 书籍列表
 */
const extractTchBook = async (http, books) => {
  books.forEach(async (book, index, books) => {
    try {
      await downloadSingleBook(http, book, index, books.length);
    } catch (error) {
      logger.error(`${book.title} ${book.id} 下载失败: ${error}\n`);
    }
  });
};

module.exports = {
  extractTchBook,
};
