import { request } from '@/lib/request'

export function getFundDeatil (fundcode) {
  return request({
    url: `/FundMNewApi/FundMNInverstPosition?FCODE=${fundcode}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=${new Date().getTime()}`,
    method: 'get'
  })
}
export function getStockData (stockList) {
  return request({
    url: `https://push2.eastmoney.com/api/qt/ulist.np/get?fields=f1,f2,f3,f4,f12,f13,f14,f292&fltt=2&secids=${stockList}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=`,
    method: 'get'
  })
}
