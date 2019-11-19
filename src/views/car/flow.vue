<template>
  <!-- 路侧 -->
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="dimension" placeholder="统计维度" style="width: 100px">
        <el-option
          v-for="item in dimensionArr"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.provinceId" placeholder="省" @change="getGeos(listQuery.provinceId, 'city')" style="width: 100px">
        <el-option
          v-for="item in provinceList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.cityId" placeholder="市"  @change="getGeos(listQuery.cityId, 'county')" style="width: 100px">
        <el-option
          v-for="item in cityList"
          :key="item.geoId"
          :label="item.geoName"
          :value="item.geoId">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.countyId" placeholder="区" @change="getPosititionsConditon" style="width: 100px">
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
      <el-date-picker
        v-model="daterange"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="search">查询</el-button>
    </div>

    <ve-histogram :data="barData" :settings="chartSettings"></ve-histogram>
    <el-table
      v-loading="loading"
      :key="0"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'序号'" type="index" width="60"></el-table-column>
      <el-table-column :label="'网点'" prop="name"></el-table-column>
      <el-table-column :label="'时间'" prop="countTime"></el-table-column>
      <el-table-column :label="'车流数量'" prop="count"></el-table-column>
      <el-table-column :label="'操作'" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" style="width: 80px" @click="handleUpdate(scope.row)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { getCarFlowCount, getGeosPosition, getAttributions, getPosititionsConditon } from '@/api/api'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { formatDay } from '@/utils'

export default {
  components: { Pagination },
  data() {
    this.chartSettings = {
    }
    return {
      list: [],
      total: 0,
      dimension: 2,
      loading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        provinceId: '',
        
        cityId: '',
        countyId: '',
        endTime: '',
        posititionId: '',
        startTime: ''
      },
      dimensionArr: [{
        name: '天',
        value: 1
      }, {
        name: '小时',
        value: 2
      }],
      daterange: [],
      countyList: [],
      cityList: [],
      provinceList: [],
      attributionList: [],
      posititionList: [],
      barData: {
        columns: ['时间', '车流量'],
        rows: []
      },
    }
  },
  created() {
    this.getGeos('100000', 'province')
    const to = new Date();
    const from = new Date();
    from.setTime(from.getTime() - 3600 * 1000 * 24)
    this.daterange = [from, to]
    this.getList()
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
      if (this.dimension === 1) {
        this.listQuery.dimension = 'DAY'
      } else {
        this.listQuery.dimension = 'HOURS'
      }
      this.loading = true
      getCarFlowCount(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.barData.rows = []
        response.data.records.forEach((item, i) => {
          let obj = {}
          obj['时间'] = item.countTime
          // obj['网点'] = item.name
          obj['车流量'] = item.count
          this.barData.rows.push(obj)
        })
        this.loading = false
      }).catch(error => console.error(error))
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
    handleUpdate (row) {
      this.$router.push('/car/list?posititionId=' + row.id)
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

