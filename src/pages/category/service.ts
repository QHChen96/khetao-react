import request from "@/utils/request";
import { CategoryListParams, Category } from "./data";
import { uniqueId } from "lodash";

export async function refreshCategory() {
  return request('/');
}

export async function delCategory(id: number) {
  return request('/server/category/delete', {
    requestType: 'json',
    params: {
      id: id
    }
  });
}

export async function saveCategory(category: Category) {
  return request('/server/category/save', {
    requestType: 'json',
    method: 'POST',
    data: category
  });
  
}

export async function queryCategory(params: CategoryListParams) {
  return request('/server/category/list');
}