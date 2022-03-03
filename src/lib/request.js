import axios from 'axios'

const fetch = (options) => {
  const { method = 'get', data, url } = options
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, data)
    case 'post':
      return axios.post(url, data)
    case 'delete':
      return axios.delete(url, { data })
    case 'put':
      return axios.put(url, data)
    case 'patch':
      return axios.patch(url, data)
    default:
      return axios(options)
  }
}

const request = (options) => {
  return fetch(options)
    .then((response) => {
      return Promise.resolve(response.data)
    })
    .catch((error) => {
      console.log(error)
      return Promise.reject(new Error('网络错误！'))
    })
}

export { request }
