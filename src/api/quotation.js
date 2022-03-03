import { request } from '@/lib/request'

// 获取大盘数据
export function getIndFundInfo (seciList) {
  return request({
    url: `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f2,f3,f4,f12,f13,f14&secids=${seciList}&_=${new Date().getTime()}`,
    method: 'get'
  })
}
