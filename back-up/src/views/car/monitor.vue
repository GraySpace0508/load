<template>
  <!-- 首页 -->
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.provinceId" placeholder="省" style="width: 90px; " @change="getGeos(listQuery.provinceId, 'city')">
        <el-option
          v-for="item in provinceList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.cityId" placeholder="市" style="width: 90px; " @change="getGeos(listQuery.cityId, 'county')">
        <el-option
          v-for="item in cityList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.countyId" placeholder="区" style="width: 90px;" @change="getPosititionsConditon">
        <el-option
          v-for="item in countyList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">查询</el-button>
    </div>
    <el-row :gutter="40" class="panel-group" v-if="cameraStatus">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link to="/site/monitor_detail" tag="div" class="card-panel">
          <div class="card-panel-icon-wrapper icon-equip-total">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">设备总数</div>
            <count-to :start-val="0" :end-val="cameraStatus['设备总数'] ? cameraStatus['设备总数'] : 0" :duration="2600" class="card-panel-num"/>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link to="/site/monitor_detail" tag="div" class="card-panel">
          <div class="card-panel-icon-wrapper icon-online">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">在线设备</div>
            <count-to :start-val="0" :end-val="cameraStatus['在线设备'] ? cameraStatus['在线设备'] : 0" :duration="3000" class="card-panel-num"/>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link to="/site/monitor_detail" tag="div" class="card-panel">
          <div class="card-panel-icon-wrapper icon-offline">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">离线设备</div>
            <count-to :start-val="0" :end-val="cameraStatus['离线设备'] ? cameraStatus['离线设备'] : 0" :duration="3200" class="card-panel-num"/>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link to="/site/monitor_detail" tag="div" class="card-panel">
          <div class="card-panel-icon-wrapper icon-equip-error">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">故障设备</div>
            <count-to :start-val="0" :end-val="cameraStatus['故障设备'] ? cameraStatus['故障设备'] : 0" :duration="3600" class="card-panel-num"/>
          </div>
        </router-link>
      </el-col>
    </el-row>
    <!-- <router-link to="/site/monitor"> -->
      <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-marker v-for="(item, i) in points" :key="i" :position="item.position" :dragging="true" @click="monitorClick(i)">
          <bm-label :content="item.name" :labelStyle="labelStyle" :offset="{width: -35, height: 30}"/>
        </bm-marker>
      </baidu-map>
    <!-- </router-link> -->
    <el-row :gutter="40" style="padding-top: 30px;">
      <el-col :span="12">
        <!-- <pie-chart :pie-chart="pieData"></pie-chart> -->
        <ve-histogram :data="flowData"></ve-histogram>
        <h2 style="font-size: 14px; font-weight: normal; text-align: center; color: #000; margin-top: 10px; position: relative; top: -40px;">车流量top10网点({{nowDate}})</h2>
      </el-col>
      <el-col :span="12">
        
        <!-- <bar-chart :xAxisData="xAxisData" :barSeries="barSeries"></bar-chart> -->
        <router-link to="/car/flow">
          <ve-histogram :data="barData"></ve-histogram>
        </router-link>
        <h2 style="font-size: 14px; font-weight: normal; text-align: center; color: #000; margin-top: 10px; position: relative; top: -40px;">24小时内车流量统计图({{nowDate}})</h2>
      </el-col>
    </el-row>
    
    <div class="filter-container">
      <el-select v-model="query.posititionId" placeholder="网点" style="width: 100px; ">
        <el-option
          v-for="item in posititionList"
          :key="item.posititionId"
          :label="item.name"
          :value="item.posititionId">
        </el-option>
      </el-select>
      <el-input placeholder="车速区间" v-model="query.speedStart" style="width: 100px; position: relative; top: 5px;" class="filter-item" @keyup.enter.native="handleFilter"/> -
      <el-input placeholder="车速区间" v-model="query.speedEnd" style="width: 100px; position: relative;  top: 5px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="query.plateColor" placeholder="车牌颜色" style="width: 100px; ">
        <el-option
          v-for="item in colorList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleFilter">查询</el-button>
    </div>
    <el-row :gutter="40">
      <el-col :span="12">
        <!-- <h2 style="font-size: 14px; text-align: center; color: #F56C6C; margin-top: 30px;"></h2> -->
        <!-- <pie-chart :pie-chart="pieData"></pie-chart> -->
       <ve-histogram :data="secondData"></ve-histogram>
       <h2 style="font-size: 14px; font-weight: normal; text-align: center; color: #000; margin-top: 10px; position: relative; top: -40px;">当前网点过去一分钟内每秒的车流量统计图({{nowDate}})</h2>
       <router-link :to="'/car/list?provinceId=' + listQuery.provinceId + '&cityId=' + listQuery.cityId + '&countyId=' + listQuery.countyId + '&posititionId=' + query.posititionId + '&speedStart=' + query.speedStart + '&speedEnd=' + query.speedEnd + '&plateColor=' + query.plateColor"><el-button type="primary" size="mini" round>查看更多</el-button></router-link> 
      </el-col>
      <el-col :span="12">
        <!-- <bar-chart :xAxisData="xAxisData" :barSeries="barSeries"></bar-chart> -->
        <router-link to="/car/violation_database"><ve-histogram :data="pieData"></ve-histogram></router-link>
        <h2 style="font-size: 14px; font-weight: normal; text-align: center; color: #000; margin-top: 10px; position: relative; top: -40px;">违章车辆TOP10网点({{nowDate}})</h2>
      </el-col>
    </el-row>
    <!-- <div class="index-flow">
      <div class="index-flow-title">
        <h2>车流信息</h2>
        <router-link to="/car/list">查看更多</router-link>
      </div>
      <el-table
      :key="0"
      :data="carFlowList"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'车牌'" prop="plateNo"></el-table-column>
      <el-table-column :label="'车牌颜色'" prop="plateColor"></el-table-column>
      <el-table-column :label="'车速'" prop="speed"></el-table-column>
      <el-table-column :label="'区域'" prop="attribution"></el-table-column>
      <el-table-column :label="'网点'" prop="posititionName"></el-table-column>
      <el-table-column :label="'时间'" prop="time"></el-table-column>
      
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="searchCarFlowSimple" />
    </div> -->
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import {  getCameraStatistics, getCarViolationStatics, getCarFlowStatisc, getGeosPosition, getPosititionsConditon, getCarFlowGroupHours, getCarFlowGroupSecond } from '@/api/api'
import Pagination from '@/components/Pagination' 
import { getDates } from '@/utils'
const animationDuration = 6000
export default {
  components: { CountTo, Pagination },
  data() {
    this.pieSettings = {
      roseType: 'radius'
    }
    return {
      daterange: [],
      listQuery: {
        page: 1,
        pageSize: 20,
        provinceId: '',
        cityId: '',
        countyId: ''
      },
      query: {
        posititionId: '',
        speedStart: '',
        speedEnd: '',
        plateColor: ''
      },
      roleList: [],
      cameraStatus: null,
      cityList: [],
      provinceList: [],
      countyList: [],
      attributionList: [],
      pieData: {
        columns: ['网点', '违章数(单位:次)'],
        rows: []
      },
      flowData: {
        columns: ['网点', '总流量(单位:车次)'],
        rows: []
      },
      timer: null,
      barData: {
        columns: ['网点', '流量(单位:车次)'],
        rows: []
      },
      secondData: {
        columns: ['网点', '流量(单位:车次)'],
        rows: []
      },
      labelStyle: {border: '1px sllid #333', color: '#999', fontSize : '14px'},
      colorList: ['蓝', '绿', '黄', '黑', '红'],
      points: [],
      carFlowList: [],
      center: { lng: 0, lat: 0},
      zoom: 6,
      list: [],
      total: 0,
      recordsData: [],
      posititionList: [],
      nowDate: ''
    }
  },
  created() {
  
    this.getGeos(100000, 'province')
    this.getPosititionsConditon()
    this.getCarViolation()
    this.getCarFlow()
    this.getCarFlowGroupHours()
    this.getCameraStatistics()
    // this.searchCarFlowSimple()
    this.nowDate = getDates()
  },
  methods: {
    getCameraStatistics () {
      let params = {
        provinceId: this.listQuery.provinceId ? this.listQuery.provinceId : null,
        cityId: this.listQuery.cityId ? this.listQuery.cityId : null,
        countyId: this.listQuery.countyId ? this.listQuery.countyId : null
      }
      getCameraStatistics(params).then(res => {
        this.cameraStatus = res.data
      })
    },
    handler ({ BMap, map}) {
      this.center.lng = 112.945473
      this.center.lat = 28.234889
      this.zoom = 11
    },
    getCarViolation () {
      // let params = Object.assign({}, {violation: 0}, this.listQuery)
      let params = {
        page: 1,
        pageSize: 20,
        violation: 0,
        provinceId: this.listQuery.provinceId ? this.listQuery.provinceId : null,
        cityId: this.listQuery.cityId ? this.listQuery.cityId : null,
        countyId: this.listQuery.countyId ? this.listQuery.countyId : null
      }
      getCarViolationStatics(params).then(res => {
        // this.getPosititions()
        this.pieData.rows = []
        res.data.forEach((item, i) => {
          let obj = {}
          obj['网点'] = item.name
          // obj['总流量'] = item.totalNum
          obj['违章数(单位:次)'] = item.violationNum
          this.pieData.rows.push(obj)
        })
        if (res.data.length < 5) {
          for(let i = 0; i < (5 - res.data.length); i++) {
            let obj = {}
            obj['网点'] = ''
            // obj['总流量'] = 0
            obj['违章数(单位:次)'] = 0
            this.pieData.rows.push(obj)
          }
        }
      })
    },
    getCarFlow () {
      // let params = Object.assign({}, {violation: 1}, this.listQuery)
      let params = {
        // violation: 1,
        provinceId: this.listQuery.provinceId ? this.listQuery.provinceId : null,
        cityId: this.listQuery.cityId ? this.listQuery.cityId : null,
        countyId: this.listQuery.countyId ? this.listQuery.countyId : null
      }
      getCarViolationStatics(params).then(res => {
        // this.getPosititions()
        this.flowData.rows = []
        res.data.forEach((item, i) => {
          let obj = {}
          obj['网点'] = item.name
          obj['总流量(单位:车次)'] = item.totalNum
          // obj['违章数'] = item.violationNum
          this.flowData.rows.push(obj)
        })
        if (res.data.length < 5) {
          for(let i = 0; i < (5 - res.data.length); i++) {
            let obj = {}
            obj['网点'] = ''
            obj['总流量(单位:车次)'] = 0
            // obj['违章数'] = 0
            this.flowData.rows.push(obj)
          }
        }
      })
    },
    getCarFlowGroupSecond () {
      // let params = Object.assign({},this.listQuery, this.query)
      let params = {
        violation: 0,
        provinceId: this.listQuery.provinceId ? this.listQuery.provinceId : null,
        cityId: this.listQuery.cityId ? this.listQuery.cityId : null,
        countyId: this.listQuery.countyId ? this.listQuery.countyId : null,
        posititionId: this.query.posititionId ? this.query.posititionId : null,
        speedStart: this.query.speedStart ? this.query.speedStart: null,
        speedEnd: this.query.speedEnd ? this.query.speedEnd : null,
        plateColor: this.query.plateColor ? this.query.plateColor : null
      }
      getCarFlowGroupSecond(params).then(res => {
        if (res && res.data) {
          this.secondData.rows = []
          res.data.forEach(item => {
            let obj = {}
            obj['网点'] = item.groupName
            obj['流量(单位:车次)'] = item.groupNum
            this.secondData.rows.push(obj)
          })
        }
      })
    },
    // getPosititions () {
    //   getPosititions().then(res => {
    //     if (res && res.status === 200) {
    //       this.recordsData = res.data.records
    //       res.data.records.forEach(element => {
    //         this.points.push({lng: element.geoLongitude, lat: element.geoLatitude})
    //       });
    //       let total = res.data.records.length
    //       let i = 0
    //       this.getCarFlow(res.data.records[i].posititionId)
    //       this.timer = setInterval(() => {
    //         this.getCarFlow(res.data.records[i].posititionId)
    //         if (i === total) {
    //           i = 0
    //         }
    //       }, 5000)
    //     }
    //   })
    // },
    getCarFlowGroupHours () {
      let params = {
        violation: 0,
        provinceId: this.listQuery.provinceId ? this.listQuery.provinceId : null,
        cityId: this.listQuery.cityId ? this.listQuery.cityId : null,
        countyId: this.listQuery.countyId ? this.listQuery.countyId : null
      }
      getCarFlowGroupHours(params).then(res => {
        if (res && res.data) {
          this.barData.rows = []
          res.data.forEach(item => {
            let obj = {}
            obj['网点'] = item.groupName
            obj['流量(单位:车次)'] = item.groupNum
            this.barData.rows.push(obj)
          })
        }
      })
    },
    handleCreate () {
      // this.getPosititionsConditon()
      clearInterval(this.timer)
      this.getCarViolation()
      this.getCarFlow()
      this.getCameraStatistics()
      this.getCarFlowGroupHours()
      this.getCarFlowGroupSecond()
      this.timer = setInterval(() => {
        this.getCarFlowGroupSecond()
      }, 5000)
      // this.searchCarFlowSimple()
    },
    
    // 过滤列表数据 
    handleFilter() {
      clearInterval(this.timer)
      // this.getCameraStatistics()
      this.getCarFlowGroupSecond()
      this.timer = setInterval(() => {
        this.getCarFlowGroupSecond()
      }, 5000)
    },
    getGeos (id, type) {
      getGeosPosition(id).then(res => {
        if (type === 'province') {
          this.cityList = []
          this.countyList = []
          this.provinceList = res.data
        }
        if (type === 'city') {
          this.countyList = []
          this.cityList = res.data
        }
        if (type === 'county') {
          this.countyList = res.data
        }
      })
      
    },
    // searchCarFlowSimple () {
    //   if (!this.query.positionId) delete this.query.positionId
    //   if (!this.query.limtSpeed) delete this.query.limtSpeed
    //   if (!this.query.maxSpeed) delete this.query.maxSpeed
    //   if (!this.query.plateColor) delete this.query.plateColor
    //   searchCarFlowSimple(this.query).then(res => {
    //     if (res && res.data && res.data.records) {
    //       this.flowData.rows = []
    //       res.data.records.forEach(item => {
    //         let obj = {}
    //         obj['网点'] = item.posititionName
    //         obj['车速'] = item.speed
    //         this.flowData.rows.push(obj)
    //       })
    //     }
    //     // this.carFlowList = res.data.records
    //     // this.total = res.data.total
    //   })
    // },
    monitorClick (i) {
      this.$router.push('/site/monitor?id=' + this.posititionList[i].posititionId)
    },
    getPosititionsConditon() {
      let params = {
        provinceId: this.listQuery.provinceId,
        cityId: this.listQuery.cityId,
        countyId: this.listQuery.countyId
      }
      getPosititionsConditon(params).then(res => {
        this.posititionList = res.data
        if (res && res.data && res.data.length > 0) {
          this.query.posititionId = res.data[0].posititionId
          res.data.forEach(element => {
            this.points.push({
              position: {lng: element.geoLongitude, lat: element.geoLatitude},
              name: element.name
            })
          });
        }
        this.getCarFlowGroupSecond()
        this.timer = setInterval(() => {
          this.getCarFlowGroupSecond()
        }, 5000)
      })
    },
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.index-flow {
  &-title {
    display: flex;
    margin-top: 30px;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      margin: 0;
      padding: 0;
    }
    a {
      color: #409EFF;
      font-size: 12px;
      padding-top: 10px;
    }
  }
}
.map {
    width: 100%;
    height: 450px;
  }
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-equip-total {
         background: #40c9c6;
      }
      .icon-online {
        background: #36a3f7;
      }
      .icon-offline {
        background: #C5CED7;
      }
      .icon-equip-error {
        background: #f4516c
      }
    }
    .icon-equip-total {
      color: #40c9c6;
    }
    .icon-online {
      color: #36a3f7;
    }
    .icon-offline {
      color: #C5CED7;
    }
    .icon-equip-error {
      color: #f4516c
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      font-size: 48px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>