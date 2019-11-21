<template>
  <!-- 路侧 -->
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.provinceId" placeholder="省" style="width: 100px">
        <el-option
          v-for="item in provinceList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.cityId" placeholder="市"  style="width: 100px">
        <el-option
          v-for="item in cityList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.countyId" placeholder="区" style="width: 100px">
        <el-option
          v-for="item in countyList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.posititionId" placeholder="网点" style="width: 100px">
        <el-option
          v-for="item in posititionList"
          :key="item.posititionId"
          :label="item.name"
          :value="item.posititionId">
        </el-option>
      </el-select>
      <!-- <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker> -->
      <el-date-picker
        v-model="daterange"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-input v-model="listQuery.plateNo" placeholder="车牌" style="width: 150px;" ></el-input>
      <el-select v-model="listQuery.attribution" placeholder="车牌归属地" style="width: 100px">
        <el-option
          v-for="item in attributionList"
          :key="item.attributionChar"
          :label="item.attributionName"
          :value="item.attributionChar">
        </el-option>
      </el-select>
      <el-input placeholder="车速区间" v-model="listQuery.speedStart" style="width: 100px; position: relative; top: 5px;" class="filter-item"/> -
      <el-input placeholder="车速区间" v-model="listQuery.speedEnd" style="width: 100px; position: relative;  top: 5px;" class="filter-item"/>
      <el-select v-model="listQuery.plateColor" placeholder="车牌颜色" style="width: 100px; ">
        <el-option
          v-for="item in colorList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.countType" placeholder="通过次数统计" style="width: 100px; " @change="search">
        <el-option
          v-for="item in countTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.countMin" placeholder="最少次数" style="width: 90px; " ></el-input> - 
      <el-input v-model="listQuery.countMax" placeholder="最多次数" style="width: 90px; " ></el-input>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click.stop="search">查询</el-button>
    </div>

    <el-table
      v-loading="loading"
      :key="0"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'车牌'" prop="plateNo"></el-table-column>
      <el-table-column :label="this.listQuery.countType && this.listQuery.countType === 'MONTH' ? '上月通过次数' : '上周通过次数'" prop="countValue"></el-table-column>
      <el-table-column :label="'通过时间'" prop="time"></el-table-column>
      <el-table-column :label="'车牌颜色'" prop="plateColor"></el-table-column>
      <el-table-column :label="'车速'" prop="speed"></el-table-column>
      <el-table-column :label="'归属地'" prop="attribution"></el-table-column>
      <el-table-column :label="'网点'" prop="posititionName"></el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { searchCarFlowSimple, getGeosPosition, getAttributions, getPosititionsConditon, getPosititionsDetail } from '@/api/api'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { formatDay } from '@/utils'

export default {
  components: { Pagination },
  data() {
    
    return {
      list: [],
      total: 0,
      loading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        provinceId: '',
        cityId: '',
        countyId: '',
        attribution: '',
        endTime: '',
        plateNo: '',
        posititionId: '',
        startTime: '',
        plateColor: '',
        speedStart: '',
        speedEnd: '',
        countType: 'WEEK',
        countMin: '',
        countMax: ''
      },
      colorList: ['蓝', '绿', '黄', '黑', '红'],
      daterange: [],
      countyList: [],
      cityList: [],
      provinceList: [],
      attributionList: [],
      countTypeList: [{
        value: 'WEEK',
        name: '周'
      }, {
        value: 'MONTH',
        name: '月'
      }],
      posititionList: []
    }
  },
  created() {
    const to = new Date();
    const from = new Date();
    from.setTime(from.getTime() - 3600 * 1000 * 24)
    this.daterange = [from, to]
    if (this.$route.query.provinceId) {
      this.listQuery.provinceId = this.$route.query.provinceId
    }
    if (this.$route.query.cityId) {
      this.listQuery.cityId = this.$route.query.cityId
    }
    if (this.$route.query.countyId) {
      this.listQuery.countyId = this.$route.query.countyId
    }
    if (this.$route.query.speedStart) {
      this.listQuery.speedStart = this.$route.query.speedStart
    }
    if (this.$route.query.speedEnd) {
      this.listQuery.speedEnd = this.$route.query.speedEnd
    }
    if (this.$route.query.plateColor) {
      this.listQuery.plateColor = this.$route.query.plateColor
    }
    if (this.$route.query.posititionId) {
      this.listQuery.posititionId = this.$route.query.posititionId
      if (!this.$route.query.provinceId) {
        this.getPosititionsDetail(this.listQuery.posititionId)
      } else {
        this.getList()
      }
    } else {
      this.getList()
    }
    this.getGeos('100000', 'province')
    this.getAttributions()
    
  },
  watch: {
    'listQuery.provinceId' (val) {
      this.cityList = []
      this.countyList = []
      this.getGeos(this.listQuery.provinceId, 'city')
    },
    'listQuery.cityId' (val) {
      console.log('333')
      this.countyList = []
      this.getGeos(this.listQuery.cityId, 'county')
    },
    'listQuery.countyId' (val) {
      if (!val) return
      this.getPosititionsConditon()
    }
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listQuery.startTime = this.daterange && this.daterange.length > 0 ? formatDay(this.daterange[0]) : ''
      this.listQuery.endTime = this.daterange && this.daterange.length > 1 ? formatDay(this.daterange[1]) : ''
      if (!this.listQuery.endTime)  delete this.listQuery.endTime
      if (!this.listQuery.startTime) delete this.listQuery.startTime
      if (!this.listQuery.provinceId) delete this.listQuery.provinceId
      if (!this.listQuery.cityId) delete this.listQuery.cityId
      if (!this.listQuery.countyId) delete this.listQuery.countyId
      if (!this.listQuery.attribution) delete this.listQuery.attribution
      if (!this.listQuery.plateNo) delete this.listQuery.plateNo
      if (!this.listQuery.posititionId) delete this.listQuery.posititionId
      if (!this.listQuery.plateColor) delete this.listQuery.plateColor
      if (!this.listQuery.speedStart) delete this.listQuery.speedStart
      if (!this.listQuery.speedEnd) delete this.listQuery.speedEnd
      if (!this.listQuery.countType) delete this.listQuery.countType
      if (!this.listQuery.countMin) delete this.listQuery.countMin
      if (!this.listQuery.countMax) delete this.listQuery.countMax
      this.listQuery.openCount = true
      this.loading = true
      searchCarFlowSimple(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.loading = false
      }).catch(error => console.error(error))
    },
    getPosititionsDetail (id) {
      getPosititionsDetail(id).then(res => {
        this.listQuery.provinceId = res.data.provinceId
        this.getGeos(this.listQuery.provinceId, 'city')
        this.listQuery.cityId = res.data.cityId
        this.getGeos(this.listQuery.cityId, 'county')
        this.listQuery.countyId = res.data.countyID
        this.getPosititionsConditon()
        this.getList()
      })
    },
    getAttributions() {
      getAttributions().then(res => {
        this.attributionList = res.data
      })
    },
    getPosititionsConditon() {
      getPosititionsConditon(this.listQuery).then(res => {
        this.posititionList = res.data
      })
    },
    getGeos (id, type) {
      if (!id) return
      getGeosPosition(id).then(res => {
        if (type === 'province') {
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
    search () {
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.depart-tree {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  width: 100%;
  z-index: 10;
}
</style>

