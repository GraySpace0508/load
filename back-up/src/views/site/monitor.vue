<template>
  <!-- 监控 -->
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.provinceId" placeholder="省" @change="getGeos(listQuery.provinceId, 'city')" style="width: 100px; ">
        <el-option
          v-for="item in provinceList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.cityId" placeholder="市"  @change="getGeos(listQuery.cityId, 'county')" style="width: 100px; ">
        <el-option
          v-for="item in cityList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.countyId" placeholder="区" @change="getPosititionsConditon" style="width: 100px; ">
        <el-option
          v-for="item in countyList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.posititionId" placeholder="网点" style="width: 100px; ">
        <el-option
          v-for="item in posititionList"
          :key="item.posititionId"
          :label="item.name"
          :value="item.posititionId">
        </el-option>
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="search">查询</el-button>
    </div>

    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="视频">
        <el-row :gutter="20">
          <!-- <el-col :span="8">
            <object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" codebase="http://download.videolan.org/pub/videolan/vlc/last/win32/axvlc.cab" id="vlc">
                <embed type="application/x-vlc-plugin" pluginspage="http://www.videolan.org" name="vlc" />
                <param name='mrl' value='rtsp://admin:1234qwer@24h794p775.wicp.vip:54135/h264/ch1/main/av_stream' />
                <param name='volume' value='0' />
                <param name='autoplay' value='true' />
                <param name='loop' value='flase' />
                <param name='fullscreen' value='false' />
            </object>
          </el-col> -->
          <el-col :span="8" v-for="(item, i) in videoList" :key="i">
            <p>摄像头编号：{{item.cameraNo}}</p>
            <video controls="controls" poster="@/assets/play.png" :src="item.ip" width="100%" height="350px" type="video/ogg">
              您的浏览器不支持 video 标签。
            </video>
          </el-col>
        </el-row>
        
      </el-tab-pane>
      <el-tab-pane label="大屏" style="overflow: hidden;">
        <el-row :gutter="20" style="margin-bottom: 30px;">
          <el-col :span="8" v-for="(item, i) in list" :key="i" style="margin-bottom: 30px;">
            <div class="card">
              <div class="card-top">
                <div class="card-top-left">
                  时间：{{item.time}}
                </div>
                <div class="card-top-right">
                  <p>位置：{{item.posititionName}}</p>
                  <p>编号：{{item.code}}</p>
                </div>
              </div>
              <div class="card-plateno">车牌：{{item.plateNo}}</div>
              <div class="card-plateno">时速：{{item.speed}}</div>
              <div class="card-plateno">请您减速慢行</div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <pagination v-if="tabPosition === '视频'" v-show="total>0" :total="videoTotal" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <pagination v-if="tabPosition === '大屏'" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="searchCarFlowSimple" />
   
  </div>
</template>

<script>
import { getCameras, searchCarFlowSimple, getGeosPosition, getAttributions, getPosititions } from '@/api/api'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
let oWebControl = null // 插件对象
let bIE = (!!window.ActiveXObject || 'ActiveXObject' in window) // 是否为IE浏览器
let pubKey = ''
let initCount = 0;

export default {
  components: { Pagination },
  data() {
    
    return {
      tabPosition: '视频',
      list: [],
      videoList: [],
      total: 0,
      videoTotal: 0,
      listQuery: {
        page: 1,
        pageSize: 9,
        provinceId: '',
        cityId: '',
        countyId: '',
        posititionId: ''
      },
      daterange: [],
      countyList: [],
      cityList: [],
      provinceList: [],
      posititionList: [],
      timer: null
    }
  },
  created() {
    this.getGeos('100000', 'province')
    if (this.$route.query.id) {
      this.listQuery.posititionId = this.$route.query.id
    }
    this.getList()
    this.getPosititionsConditon()
    this.searchCarFlowSimple()
    this.timer = setInterval(() => {
      this.searchCarFlowSimple()
    }, 30000)
  },
  methods: {
    // 获取列表数据
    getList() {
      getCameras(this.listQuery).then(response => {
        this.videoList = response.data.records
        this.videoTotal = response.data.total
      }).catch(error => console.error(error))
    },
    // 获取列表数据
    searchCarFlowSimple() {
      if(!this.listQuery.provinceId) delete this.listQuery.provinceId
      if(!this.listQuery.cityId) delete this.listQuery.cityId
      if(!this.listQuery.countyId) delete this.listQuery.countyId
      if(!this.listQuery.posititionId) delete this.listQuery.posititionId
      this.listQuery.violation = 0
      this.listQuery.orderType = 'DESC'
      searchCarFlowSimple(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
      }).catch(error => console.error(error))
    },
    getPosititionsConditon() {
      // if(!this.listQuery.provinceId) delete this.listQuery.provinceId
      // if(!this.listQuery.cityId) delete this.listQuery.cityId
      // if(!this.listQuery.countyId) delete this.listQuery.countyId
      this.listQuery.size = 10000
      getPosititions(this.listQuery).then(res => {
        this.posititionList = res.data.records
      })
    },
    getGeos (id, type) {
      getGeosPosition(id).then(res => {
        if (type === 'province') {
          this.cityList = []
          this.countyList = []
          this.posititionList = []
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
    monitorDetail () {
      this.$router.push('/site/monitor_detail?id=' + row.monitorId)
    },
    search () {
      this.getList()
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="scss">
.card {
  background:linear-gradient(87deg,rgba(239,214,151,1) 0%,rgba(249,229,173,1) 100%);
  box-shadow: 0 0 10px #ccc;
  padding: 20px 30px;
  &-top {
    font-size: 12px;
    overflow: hidden;
    &-left {
      float: left;
    }
    &-right {
      float: right;
      p {
        padding: 0;
        margin: 0;
      }
    }
  }
  &-plateno {
    font-size: 18px;
    margin: 20px 0;
  }
}
</style>

