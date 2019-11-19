<template>
  <!-- 违章 -->
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
      <!-- <el-date-picker
        style=""
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
      <el-input v-model="listQuery.plateNo" placeholder="车牌" style="width: 150px; " ></el-input>
      <el-select v-model="listQuery.attribution" placeholder="车牌归属地" style="width: 100px; ">
        <el-option
          v-for="item in attributionList"
          :key="item.attributionChar"
          :label="item.attributionName"
          :value="item.attributionChar">
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="search">查询</el-button>
    </div>

    <el-table
      v-loading="loading"
      :key="0"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'违章编码'" prop="carsFlowId"></el-table-column>
      <el-table-column :label="'车牌'" prop="plateNo"></el-table-column>
      <el-table-column :label="this.listQuery.countType && this.listQuery.countType === 'MONTH' ? '上月通过次数' : '上周通过次数'" prop="countValue"></el-table-column>
      <!-- <el-table-column v-if="this.listQuery.countType && this.listQuery.countType === 'MONTH'" :label="" prop="countValue"></el-table-column> -->
      <!-- <el-table-column :label="'网点编号'" prop="position"></el-table-column> -->
      <el-table-column :label="'违章原因'" prop="reason"></el-table-column>
      <el-table-column :label="'限速'" prop="limitSpeed"></el-table-column>
      <el-table-column :label="'车速'" prop="speed"></el-table-column>
      <el-table-column :label="'违章抓拍点'" prop="posititionName"></el-table-column>
      <el-table-column :label="'抓拍时间'" prop="time"></el-table-column>
      <el-table-column :label="'操作'" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/car/violation_detail?id=' + scope.row.carsFlowId" target="_blank">
            <el-button type="primary" size="mini" style="width: 80px">查看明细</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { searchCarFlowSimple, getGeosPosition, getAttributions, getPosititionsConditon } from '@/api/api'
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
        violation: 0,
        provinceId: '',
        cityId: '',
        countyId: '',
        attribution: '',
        endTime: '',
        plateNo: '',
        posititionId: '',
        startTime: '',
        countType: 'WEEK',
        countMin: '',
        countMax: ''
      },
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
    this.getGeos('100000', 'province')
    this.getAttributions()
    const to = new Date();
    const from = new Date();
    from.setTime(from.getTime() - 3600 * 1000 * 24)
    this.daterange = [from, to]
    this.getList()
    // this.getRoles()
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
    search () {
      this.getList()
    },
    // handleUpdate (row) {
    //   window.open('/car/violation_detail?id=' + row.carsFlowId, '_blank')
    // }
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

