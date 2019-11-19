import request from '@/utils/request'

// 根据省市县ID，查询摄像机状态汇总信息
export function getCameraStatistics(data) {
  return request({
    url: '/services/statistics/camera',
    method: 'get',
    params: data
  })
}

// 根据省市县ID，查询网点的违章分组信息
export function getCarViolationStatics(data) {
  return request({
    url: '/services/statistics/cars/violation',
    method: 'get',
    params: data
  })
}

// 根据省市县ID，查询网点的违章分组信息
export function getCarFlowStatisc(data) {
  return request({
    url: '/services/statistics/' + data.posititionId + '/cars/flow',
    method: 'get',
    params: data
  })
}

// 根据条件查询，过去12小时车流量,按小时分组
export function getCarFlowGroupHours(data) {
  return request({
    url: '/services/statistics/cars/flow/group/hours',
    method: 'get',
    params: data
  })
}

// 根据网点ID查询，过去1分钟车流量，按秒分组
export function getCarFlowGroupSecond(data) {
  return request({
    url: '/services/statistics/cars/flow/group/minute',
    method: 'get',
    params: data
  })
}

// 根据省市县,网点ID查询对应摄像机状态汇总信息
export function getPosititionCamera(data) {
  return request({
    url: '/services/statistics/positition/camera',
    method: 'get',
    params: data
  })
}

// 终端实时或者准实时把经过采集点所有的车辆的信息上报给云端
export function addCarFlow(data) {
  return request({
    url: '/services/cars/flow',
    method: 'post',
    data: data
  })
}

// 车流信息查询
export function searchCarFlowSimple(data) {
  return request({
    url: '/services/cars/flow/simple',
    method: 'post',
    data: data
  })
}

// 车流信息查询
export function gethCarFlowDetail(id) {
  return request({
    url: '/services/cars/flow/' + id,
    method: 'get'
  })
}

// 终端实时或者准实时把拍摄到的违章车辆信息上报给云端
export function getCarViolation(data) {
  return request({
    url: '/services/cars/violation',
    method: 'post',
    data: data
  })
}

// 描述：摄像机针对采集点各个摄像头的工作状态进行监控，定时向云端报告各个采集点的摄像头的工作状态： 在线、离线、故障
export function getCamerasStatus(data) {
  return request({
    url: '/services/cameras/status',
    method: 'post',
    data: data
  })
}

// 按条件查询所有摄像机
export function getCameras(data) {
  return request({
    url: '/services/cameras',
    method: 'get',
    params: data
  })
}

// 查询所有网点
export function getPosititions(data) {
  return request({
    url: '/services/posititions',
    method: 'get',
    params: data
  })
}

// 新增网点
export function addPosititions(data) {
  return request({
    url: '/services/posititions',
    method: 'post',
    data: data
  })
}

// 查询单个网点详情
export function getPosititionsDetail(id) {
  return request({
    url: '/services/posititions/' + id,
    method: 'get'
  })
}

// 修改网点
export function updatePosititions(data) {
  return request({
    url: '/services/posititions',
    method: 'put',
    data: data
  })
}

// 删除网点
export function deletePosititions(id) {
  return request({
    url: '/services/posititions/' + id,
    method: 'delete'
  })
}

// 按条件查询所有网点
export function getPosititionsConditon(data) {
  return request({
    url: '/services/posititions/conditon',
    method: 'get',
    params: data
  })
}

// 查询网点下所有摄像机
export function getPosititionsCameras(data) {
  return request({
    url: '/services/posititions/' + data.posititionId + '/cameras',
    method: 'get',
    params: data
  })
}

// 新增网点下的摄像机
export function addPosititionsCameras(data) {
  return request({
    url: '/services/posititions/' + data.posititionId + '/cameras',
    method: 'post',
    data: data
  })
}

// 修改网点下摄像机
export function updatePosititionsCameras(data) {
  return request({
    url: '/services/posititions/' + data.posititionId + '/cameras',
    method: 'put',
    data: data
  })
}

// 删除网点下的摄像机
export function deletePosititionsCameras(data) {
  return request({
    url: '/services/posititions/' + data.posititionId + '/cameras/' + data.cameraId,
    method: 'delete'
  })
}

// 查询网点下所有标签
export function getPosititionsLabel(id) {
  return request({
    url: '/services/posititions/' + id + '/labels',
    method: 'get'
  })
}

// 新增网点下标签
export function addPosititionsLabel(data) {
  return request({
    url: '/services/posititions/' + data.posititionId + '/labels',
    method: 'post',
    data: data.labels
  })
}

// 删除网点下标签
export function deletePosititionsLabel(data) {
  return request({
    url: '/services/posititions/' + data.posititionId + '/labels/' + data.labesId,
    method: 'delete'
  })
}

// 地址位置基础数据表 前端控制器
export function getGeos(id) {
  return request({
    url: '/services/geos/' + id,
    method: 'get'
  })
}

// 地址位置基础数据表 前端控制器
export function getGeosPosition(id) {
  return request({
    url: '/services/geos/positition/' + id,
    method: 'get'
  })
}

// 所有归属地查询
export function getAttributions(id) {
  return request({
    url: '/services/attributions',
    method: 'get'
  })
}

// 查询所有网点类型
export function getPosititiontypes() {
  return request({
    url: '/services/posititiontypes',
    method: 'get'
  })
}

// 新增网点类型
export function addPosititiontypes(data) {
  return request({
    url: '/services/posititiontypes',
    method: 'post',
    data: data
  })
}

// 修改网点类型
export function updatePosititiontypes(data) {
  return request({
    url: '/services/posititiontypes/' + data.posititionTypeId,
    method: 'put',
    data: data
  })
}

// 删除网点类型
export function deletePosititiontypes(id) {
  return request({
    url: '/services/posititiontypes/' + id,
    method: 'delete'
  })
}

export function getCarFlowCount(data) {
  return request({
    url: '/services/carsflows/count',
    method: 'get',
    params: data
  })
}

export function getUserplates(data) {
  return request({
    url: '/services/userplates',
    method: 'get',
    params: data
  })
}

export function deleteUserplates(id) {
  return request({
    url: '/services/userplates/' + id,
    method: 'delete'
  })
}
