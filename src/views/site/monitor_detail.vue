<template>
  <!-- 监控明细 -->
  <div class="app-container">
    <div class="filter-container">
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

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="search">查询</el-button>
    </div>

    <el-table
      v-loading="loading"
      :key="0"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'网点'" prop="posititionName"></el-table-column>
      <el-table-column :label="'网点编号'" prop="posititionNo"></el-table-column>
      <el-table-column :label="'设备总数'" prop="cameraTotal"></el-table-column>
      <el-table-column :label="'在线设备数'" prop="onlineNum"></el-table-column>
      <el-table-column :label="'离线设备数'" prop="offlineNum"></el-table-column>
      <el-table-column :label="'故障设备数'" prop="faultNum"></el-table-column>
      <el-table-column :label="'操作'" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" style="width: 100px" @click="monitorDetail(scope.row)">查看实时监控</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getPosititionCamera, getGeosPosition, getAttributions, getPosititionsConditon } from '@/api/api'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    
    return {
      list: [],
      total: 0,
      loading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        provinceId: '',
        cityId: '',
        countyId: '',
        posititionId: ''
      },
      daterange: [],
      countyList: [],
      cityList: [],
      provinceList: [],
      posititionList: []
    }
  },
  created() {
    this.getGeos('100000', 'province')
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      if (!this.listQuery.provinceId) delete this.listQuery.provinceId
      if (!this.listQuery.cityId) delete this.listQuery.cityId
      if (!this.listQuery.countyId) delete this.listQuery.countyId
      if (!this.listQuery.posititionId) delete this.listQuery.posititionId
      this.loading = true
      getPosititionCamera(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
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
    monitorDetail (row) {
      this.$router.push('/site/monitor?id=' + row.posititionId)
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

