import decode from 'jwt-decode';




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
  let now: number = Math.round(new Date().getTime()/1000);
  // 暂时只检查过期
  if (now > payload.exp) {
    return false;
  }
  return true;
}

export function clearAuthority():void {
  localStorage.removeItem(KhetaoType.AUTH_KEY);
  localStorage.removeItem(KhetaoType.TOKEN_KEY);
}

enum KhetaoType {
  TOKEN_KEY = 'khetao-jwt-token',
  AUTH_KEY = 'antd-pro-authority'
}

export { isAntDesignProOrDev, isAntDesignPro, isUrl, KhetaoType };
