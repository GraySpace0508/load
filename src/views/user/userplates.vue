<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="车牌" v-model="listQuery.plateNo" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleFilter">查询</el-button>
    </div>

    <el-table
      v-loading="loading"
      :key="tableKey"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'序号'" type="index" width="65"></el-table-column>
      <el-table-column :label="'头像'" prop="headimgurl">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" alt="">
        </template>
      </el-table-column>
      <el-table-column :label="'昵称'" prop="nickname"></el-table-column>
      <el-table-column :label="'绑定车牌'" prop="plateNo"></el-table-column>
      <el-table-column :label="'绑定时间'" prop="createdDate"></el-table-column>
      <el-table-column :label="'操作'" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" style="width: 90px;" @click="handleDelete(scope.row)">解除绑定
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getUserplates, deleteUserplates } from '@/api/api'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      loading: false,
      tableKey: 0,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
        plateNo: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true
      getUserplates(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.loading = false
      }).catch(error => console.error(error))
    },
    
    // 过滤列表数据 
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(row) {
      console.log(row)
      this.$confirm('确定要解除 车牌' + row.plateNo + ' 的绑定吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
          deleteUserplates(row.userId).then(() => {
            this.$notify({
              title: '成功',
              message: '解绑成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(err => console.error(err))
        }).catch(() => {
                 
        }) 
    }
  }
}
</script>

