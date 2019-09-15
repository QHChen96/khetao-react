import request from '@/utils/request';

export async function queryCurrent() {
  return request('/api/currentUser');
}

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
  return request('/server/image/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form'
  });
}