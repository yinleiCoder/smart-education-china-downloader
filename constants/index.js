// 电子教材分类详细信息（网络抓包）
const tchMaterialTree =
  "https://s-file-2.ykt.cbern.com.cn/zxx/ndrs/resources/tch_material/version/data_version.json";

// 电子教材真实文件存储地址（网络抓包发现该网站是批次请求后台，只是每次改变请求头参数Range: bytes=43515904-43646975）
const tchMaterialFile = (bookId) =>
  `https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets/${bookId}.pkg/pdf.pdf`;

// 书籍存放地址
const bookStorageFolder = "books";

module.exports = {
  tchMaterialTree,
  tchMaterialFile,
  bookStorageFolder,
};
