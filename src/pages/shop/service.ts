import request from '@/utils/request';
import { CustomCategory, CustomCategoryListParams } from './data';


export async function delCategory(id: number) {
  return request('/server/category/custom/delete', {
    requestType: 'json',
    params: {
      id: id
    }
  });
}

export async function saveCategory(category: CustomCategory) {
  return request('/server/category/custom/save', {
    requestType: 'json',
    method: 'POST',
    data: category
  });
  
}

export async function queryCategory(params: CustomCategoryListParams) {
  return request('/server/category/custom/list');
}