<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input placeholder="账号" v-model="listQuery.username" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="" v-model="listQuery.employeeId" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="手机" v-model="listQuery.mobile" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">添加类型</el-button>
    </div>

    <el-table
      v-loading="loading"
      :key="tableKey"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'序号'" type="index" width="65"></el-table-column>
      <el-table-column :label="'类型名称'" prop="name"></el-table-column>
      <el-table-column :label="'描述'" prop="description"></el-table-column>
      <el-table-column :label="'操作'" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
    
        <el-form-item :label="'类型名称'" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="'描述'" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPosititiontypes, addPosititiontypes, updatePosititiontypes, deletePosititiontypes} from '@/api/api'
import { validateEmail, validatePhone, validatePasswordTwo } from '@/utils/validate'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    const isValidateEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('请输入正确的邮箱！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      tableKey: 0,
      list: [],
      total: 0,
      roleList: [],
      temp: {
        name: '',
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑类型',
        create: '新增类型'
      },
      rules: {
        // departName: [{ required: true, message: '部门为必填', trigger: 'blur' }],
        name: [{ required: true, message: '类型名为必填', trigger: 'blur' }]
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
      getPosititiontypes().then(res => {
        this.list = res.data
        this.loading = false
      }).catch(error => console.error(error))
    },
    
    // 过滤列表数据 
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        name: '',
        description: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addPosititiontypes(this.temp).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp.name = row.name
      this.temp.description = row.description
      this.temp.posititionTypeId = row.posititionTypeId

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePosititiontypes(this.temp).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
          deletePosititiontypes(row.posititionTypeId).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(err => console.error(err))
        }).catch(() => {
                 
        }) 
    },
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

