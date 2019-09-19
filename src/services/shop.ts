import request from '@/utils/request';
import { CurrentShop } from '../models/shop';

export async function query(): Promise<any> {
  return request('/server/shop/list');
}

export async function queryCurrent(): Promise<any> {
  return {
    code: 200,
    msg: "SUCCESS",
    data: 2
  }
}

export async function saveBasic(shopBasic: CurrentShop): Promise<any> {
  return request('/server/shop/basic/save', {
    method: 'POST',
    requestType: 'json',
    data: shopBasic
  });
}

export async function saveWebInfo(shopWebInfo: CurrentShop): Promise<any> {
  return request('/server/shop/web-info/save', {
    method: 'POST',
    requestType: 'json',
    data: shopWebInfo
  });
}

export async function switchCurrent(id: number): Promise<any> {
  return {
    code: 200,
    msg: "SUCCESS",
    data: id
  };
}