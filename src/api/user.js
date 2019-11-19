import request from '@/utils/request'

// 新增员工
export function addUsers(data) {
  return request({
    url: '/services/users',
    method: 'post',
    data: data
  })
}
// 删除员工
export function deleteUsers(id) {
  return request({
    url: '/services/users/' + id,
    method: 'delete'
  })
}
// 获取用户基本信息服务
export function getMe() {
  return request({
    url: '/services/users/me',
    method: 'get'
  })
}
// 更新个人信息服务
export function updateMe(data) {
  return request({
    url: '/services/users/my/update',
    method: 'post',
    data: data
  })
}

// 修改密码服务
export function updatePasswrod(data) {
  return request({
    url: '/services/users/my/password',
    method: 'post',
    data: data
  })
}

// 更新用户服务
export function updateUsers(data) {
  return request({
    url: '/services/users/' + data.userId,
    method: 'post',
    data: data
  })
}

// 查询用户列表数据服务
export function getUsers(data) {
  return request({
    url: '/services/users',
    method: 'get',
    params: data
  })
}

// 查询用户详情数据服务
export function getUsersDetail(id) {
  return request({
    url: '/services/users/' + id,
    method: 'get'
  })
}

// 获取当前用户有权限的菜单列表
export function getMenus() {
  return request({
    url: '/services//menus/my',
    method: 'get'
  })
}

// 获取角色列表
export function getRoles() {
  return request({
    url: '/services/roles',
    method: 'get'
  })
}

// 获取角色列表
export function addRoles(data) {
  return request({
    url: '/services/roles',
    method: 'post',
    data: data
  })
}

// 获取角色列表
export function updateRoles(data) {
  return request({
    url: '/services/roles/' + data.roleId,
    method: 'get',
    data: data
  })
}

// 获取角色列表
export function deleteRoles() {
  return request({
    url: '/services/roles',
    method: 'delete'
  })
}

// 获取某个角色相关的权限数据
export function getRolesPermissions(id) {
  return request({
    url: '/services/roles/' + id + '/permissions',
    method: 'get'
  })
}

// 角色的权限数据更新
export function updateRolesPermissions(data) {
  return request({
    url: '/services/roles/' + data.roleId + '/permissions',
    method: 'post',
    data: data
  })
}

// 获取登录页面配置信息
export function getLoginConfig() {
  return request({
    url: '/services/loginpageconfigs',
    method: 'get'
  })
}

// 修改登录页面配置信息
export function updateLoginConfig(data) {
  return request({
    url: '/services/loginpageconfigs',
    method: 'put',
    data: data
  })
}
