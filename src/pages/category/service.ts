import request from "@/utils/request";
import { CategoryListParams, Category } from "./data";
import { uniqueId } from "lodash";

export async function refreshCategory() {
  return request('/');
}

export async function saveCategory(category: Category) {
  if (category.id) {
    return {
      code: 200,
      msg: "SUCCESS",
      data: {...category}
    }
  } else {
    return {
      code: 200,
      msg: "SUCCESS",
      data: {...category, id: uniqueId("cate_")}
    }
  }
}

export async function queryCategory(params: CategoryListParams) {
  return {
    list: [
      {
        id: 1,
        cateName: '衣服',
        priority: 10,
        i18n: 'cateName',
        level: 1,
        imageUrls: [{
          uid: '-1',
          name: '衣服.jpg',
          url: 'https://ecmb.bdimg.com/tam-ogel/299c55e31d7f50ae4dc85faa90d6f445_121_121.jpg',
          size: 10000
        }],
        parentId: 0
      }, {
        id: 11,
        cateName: '衣服1',
        priority: 10,
        i18n: 'cateName',
        level: 2,
        imageUrls: [{
          uid: '-2',
          name: '衣服1.jpg',
          url: 'https://cf.shopee.com.my/file/bde692b600727f1e1c209babc7799a37',
          size: 10000
        }],
        parentId: 1
      }, {
        id: 111,
        cateName: '衣服11',
        priority: 10,
        i18n: 'cateName',
        level: 3,
        imageUrls: [{
          uid: '-3',
          name: '衣服1.jpg',
          url: 'https://cf.shopee.com.my/file/bde692b600727f1e1c209babc7799a37',
          size: 10000
        }],
        parentId: 11
      }, {
        id: 222,
        cateName: '衣服22',
        priority: 9,
        i18n: 'cateName',
        level: 3,
        imageUrls: [
        ],
        parentId: 11
      },
      {
        id: 2,
        cateName: '裤子',
        priority: 10,
        i18n: 'cateName',
        level: 1,
        imageUrls: [{
          uid: '-1',
          name: '衣服.jpg',
          url: 'https://ecmb.bdimg.com/tam-ogel/299c55e31d7f50ae4dc85faa90d6f445_121_121.jpg',
          size: 10000
        }],
        parentId: 0
      }
    ]
  }
}