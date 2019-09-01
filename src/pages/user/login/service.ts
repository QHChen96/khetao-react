import request from '@/utils/request';
import { FromDataType } from './index';

export async function fakeAccountLogin(params: FromDataType) {

  return request('/server/login', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
