import request from '@/utils/request';

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}


export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request('/server/shop-user/upload/avatar', {
    method: 'POST',
    data: formData,
    requestType: 'form'
  });
}