import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/server/shop-user/current');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
