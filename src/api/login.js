import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/services/users/login',
    method: 'post',
    data: data
  })
}

export function getUserInfo() {
  return request({
    url: '/services/users/me',
    method: 'get'
    // params: { token }
  })
}

