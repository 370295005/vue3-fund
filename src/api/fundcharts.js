import { request } from '@/lib/request'

// 获取折线图数据
export function getFundDetail (fundcode) {
  return request({
    url: `/FundMApi/FundVarietieValuationDetail.ashx?FCODE=${fundcode}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=${new Date().getTime()}`,
    method: 'get'
  })
}
