<template>
  <div class="app-container trace">
    <p>车辆轨迹管理是基于地图服务以及车路系统的高精度定位、实时车流数据的云化传导等功能，具有精准、高性能的优点，覆盖核心管理区域，能够实现车辆热力分布、定点车辆轨迹回放等功能。</p>
    <h2>车辆热力图</h2>
    <p>1. 根据区域查询区域终端检测点的车流热力分布。</p>
    <p>2. 实时车流热力分布智能分析，对道路拥塞、车流疏导进行实时预警</p>
    <p><img src="@/assets/trace1.png" alt=""></p>
    <h2>车辆轨迹</h2>
    <p>1. 查询指定车辆的在各个监控点的驾驶轨迹，分析车辆驾驶行为</p>
    <p>2. 对重点管控车牌、车型进行驾驶区域管控、预警。</p>
    <p><img src="@/assets/trace3.jpeg" alt=""></p>
    <h2>车流信息云图</h2>
    <p>1. 高精度的车流信息抓取以及实时云化同步</p>
    <p>2. 方便、快捷的在重点区域进行布点监控。</p>
    <p><img src="@/assets/trace2.jpeg" alt=""></p>
  </div>
</template>


<style lang="scss">
.depart-tree {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  width: 100%;
  z-index: 10;
}
.trace {
  img {
    max-width: 1200px;
  }
}
</style>

