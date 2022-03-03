import { request } from '@/lib/request'

// 搜索基金

export function searchFund (query) {
  return request({
    url: `FundSearch/api/FundSearchAPI.ashx?&m=9&key=${query}&_=${new Date().getTime()}`,
    method: 'get'
  })
}
