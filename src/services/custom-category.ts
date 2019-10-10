import request from '@/utils/request';
import { CustomCategory, CustomCategoryListParams } from '@/models/custom-category';
import { RcFile } from 'antd/lib/upload/interface';

export async function delCategory(id: number) {
  return request('/server/category/custom/delete', {
    requestType: 'json',
    params: {
      id: id,
    },
  });
}

export async function saveCategory(category: CustomCategory) {
  return request('/server/category/custom/save', {
    requestType: 'json',
    method: 'POST',
    data: category,
  });
}



export async function uploadCateImg(file: RcFile) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/server/category/custom/img/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export async function queryCategory(params: CustomCategoryListParams) {
  return request('/server/category/custom/list');
}
