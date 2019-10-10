import request from '@/utils/request';
import { CategoryListParams, Category } from '@/models/category';
import { RcFile } from 'antd/lib/upload/interface';

export async function refreshCategory() {
  return request('/');
}

export async function delCategory(id: number) {
  return request('/server/category/delete', {
    requestType: 'json',
    params: {
      id: id,
    },
  });
}

export async function saveCategory(category: Category) {
  return request('/server/category/save', {
    requestType: 'json',
    method: 'POST',
    data: category,
  });
}

export async function uploadCateImg(file: RcFile) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/server/category/img/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export async function queryCategory(params?: CategoryListParams) {
  return request('/server/category/list');
}
