import { request } from '@/lib/request'

// 获取单个基金的数据
// fundcode:Number 基金编号
export function getFundInfo (fundcode) {
  return request({
    url: `/FundMApi/FundBaseTypeInformation.ashx?FCODE=${fundcode}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=${new Date().getTime()}`,
    method: 'get'
  })
}
// 获取实时基金数据
export function getFundData (userId, fundList) {
  return request({
    url: `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=200&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=${userId}&Fcodes=${fundList}`,
    method: 'get'
  })
}
// 获取节假日信息
export function getHoliday () {
  return request({
    url: 'http://x2rr.github.io/funds/holiday.json',
    method: 'get'
  })
}
