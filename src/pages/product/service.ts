import request from '@/utils/request';
import { RcFile } from 'antd/lib/upload';

export async function uploadProductImg(file: RcFile) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/server/product/img/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}
