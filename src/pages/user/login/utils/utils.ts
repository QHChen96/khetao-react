import { parse } from 'qs';
import { KhetaoType } from '@/utils/utils';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem(KhetaoType.AUTH_KEY, JSON.stringify(proAuthority));
}