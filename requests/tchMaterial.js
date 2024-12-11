const dayjs = require("dayjs");
const { tchMaterialTree } = require("../constants");

/**
 * 获取电子教材层级列表
 * @param {*} http
 * @returns
 */
const getTchTreeLinks = async (http) => {
  const { data } = await http.get(tchMaterialTree);
  return data;
};

/**
 * 根据教材层级列表清洗教材相关信息
 * @param {*} http
 * @param {*} urls 教材首页层级列表
 * @returns
 */
const getTchTreeDatas = async (http, urls) => {
  const requests = [];
  urls.forEach(async (url) => {
    requests.push(http.get(url));
  });
  const res = await Promise.all(requests);
  return res
    .map((item) => item.data)
    .reduce((pre, curr) => [...pre, ...curr], [])
    .map(
      ({
        id,
        title,
        custom_properties: { resolution, format, size, thumbnails },
        create_time,
        update_time,
        tag_list,
        tag_paths,
      }) => {
        const sortedTagPaths = tag_paths?.pop()?.split("/");
        const tags = sortedTagPaths?.map((tag_id) =>
          tag_list.find((tag) => tag.tag_id === tag_id)
        );
        return {
          id, // 教材id
          title, // 教材名称
          resolution, // 教材宽高
          size: `${(size / 1024 ** 2).toFixed(2)} MB`, // 教材大小
          format, // 教材文件格式
          thumbnail: thumbnails.pop() ?? "", // 教材封面图
          create_time: dayjs(create_time).format("YYYY年M月D日 HH:mm:ss"), // 教材创建时间
          update_time: dayjs(update_time).format("YYYY年M月D日 HH:mm:ss"), // 教材更新时间
          tags, // 标签列表
        };
      }
    );
};

module.exports = {
  getTchTreeLinks,
  getTchTreeDatas,
};
