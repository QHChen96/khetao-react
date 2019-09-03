import request from '@/utils/request';

export async function query(): Promise<any> {
  return {
    code: 200,
    msg: "SUCCESS",
    data: [{
      id: 1000,
      avatar: 'https://ecmb.bdimg.com/tam-ogel/299c55e31d7f50ae4dc85faa90d6f445_121_121.jpg',
      name: '京东',

    }, {
      id: 2000,
      avatar: 'https://ss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1831514869.jpg',
      name: '天猫',
    }]
  };
}

export async function queryCurrent(): Promise<any> {
  return {
    code: 200,
    msg: "SUCCESS",
    data: 1000
  }
}

export async function switchCurrent(id: number): Promise<any> {
  return {
    code: 200,
    msg: "SUCCESS",
    data: id
  };
}