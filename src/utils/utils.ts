import decode from 'jwt-decode';
import defaultSettings from '../../config/defaultSettings';
import { UploadFile } from 'antd/lib/upload/interface';
import { parse } from 'qs';

const { imgServerUrl } = defaultSettings;

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export function setToken(token: string): JwtPayload {
  localStorage.setItem(KhetaoType.TOKEN_KEY, token);
  return getPayload(token);
}

export function getToken() {
  let token = localStorage.getItem(KhetaoType.TOKEN_KEY);
  if (token) {
    let payload = decode(token) as JwtPayload;
    if (checkToken(payload)) {
      return token;
    }
  }
  localStorage.removeItem(KhetaoType.TOKEN_KEY);
  localStorage.removeItem(KhetaoType.AUTH_KEY);
  // 检查token
  return null;
}

export function getPayload(token: string): JwtPayload {
  return decode(token) as JwtPayload;
}

export function checkToken(payload: JwtPayload): boolean {
  if (!payload) {
    return false;
  }
  let now: number = Math.round(new Date().getTime() / 1000);
  // 暂时只检查过期
  if (now > payload.exp) {
    return false;
  }
  return true;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem(KhetaoType.AUTH_KEY, JSON.stringify(proAuthority));
}

export function clearAuthority(): void {
  localStorage.removeItem(KhetaoType.AUTH_KEY);
  localStorage.removeItem(KhetaoType.TOKEN_KEY);
}

enum KhetaoType {
  TOKEN_KEY = 'khetao-jwt-token',
  AUTH_KEY = 'antd-pro-authority',
}

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function getImg(path?: string): string {
  if (path) {
    return `${imgServerUrl}${path}`;
  }
  return '';
}

export function getUploadFiles(pathStr?: string): UploadFile[] {
  if (pathStr) {
    let paths = pathStr.split(',');
    if (paths && paths.length > 0) {
      const files: UploadFile[] = paths.map(path => {
        return {
          uid: path,
          url: getImg(path),
          name: path,
          status: 'done',
        } as UploadFile;
      });
      return files;
    }
  }
  return [];
}

export function getUploadFilesFormMedia(pathStr: string): UploadFile[] {
  if (pathStr) {
    let paths = pathStr.split(',');
    if (paths && paths.length > 0) {
      const files: UploadFile[] = paths.map(media => {
        let file: MediaFile = JSON.parse(media) as MediaFile;
        return {
          uid: file.path,
          url: getImg(file.path),
          status: 'done',
        } as UploadFile;
      });
      return files;
    }
  }
  return [];
}

export function truncate(str: string, max: number = 0): string {
  // tslint:disable-next-line:strict-type-predicates
  if (typeof str !== 'string' || max === 0) {
    return str;
  }
  return str.length <= max ? str : `${str.substr(0, max)}...`;
}

export function snipLine(line: string, colno: number): string {
  let newLine = line;
  const ll = newLine.length;
  if (ll <= 150) {
    return newLine;
  }
  if (colno > ll) {
    colno = ll; // tslint:disable-line:no-parameter-reassignment
  }

  let start = Math.max(colno - 60, 0);
  if (start < 5) {
    start = 0;
  }

  let end = Math.min(start + 140, ll);
  if (end > ll - 5) {
    end = ll;
  }
  if (end === ll) {
    start = Math.max(end - 140, 0);
  }

  newLine = newLine.slice(start, end);
  if (start > 0) {
    newLine = `'{snip} ${newLine}`;
  }
  if (end < ll) {
    newLine += ' {snip}';
  }

  return newLine;
}

export { isAntDesignProOrDev, isAntDesignPro, isUrl, KhetaoType };
