import { request } from '@/lib/request'

export function getFundInfo (fundcode) {
  return request({
    url: `/FundMApi/FundBaseTypeInformation.ashx?FCODE=${fundcode}&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&Uid=&_=${new Date().getTime()}`,
    method: 'get'
  })
}
