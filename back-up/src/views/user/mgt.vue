<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input placeholder="账号" v-model="listQuery.username" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="" v-model="listQuery.employeeId" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="手机" v-model="listQuery.mobile" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">添加员工</el-button>
    </div>

    <el-table
      v-loading="loading"
      :key="tableKey"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'序号'" type="index" width="65"></el-table-column>
      <el-table-column :label="'账号'" prop="employeeId"></el-table-column>
      <el-table-column :label="'姓名'" prop="userName"></el-table-column>
      <!-- <el-table-column :label="'角色'" prop="roleId">
        <template slot-scope="scope">
          <span v-for="(item, i) in roleList" :key="i" v-if="item.roleId === scope.row.roleId">{{item.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'邮箱'" prop="email"></el-table-column>
      <el-table-column :label="'手机'" prop="mobile"></el-table-column> -->
      <el-table-column :label="'操作'" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="wraming" size="mini" style="width: 75px;" @click="resetPassword(scope.row)">重置密码</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'账号'" prop="employeeId" >
          <el-input v-model="temp.employeeId"/>
        </el-form-item>
        <el-form-item :label="'姓名'" prop="userName">
          <el-input v-model="temp.userName"/>
        </el-form-item>
        <el-form-item :label="'密码'" prop="password" v-if="dialogStatus === 'create'">
          <el-input v-model="temp.password" type="password"/>
        </el-form-item>
        <el-form-item :label="'角色'" prop="roleId">
          <el-select v-model="temp.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="dialogPwdVisible">
      <el-form ref="pwdForm" :rules="pwdRules" :model="pwdTemp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'密码'" prop="password">
          <el-input v-model="pwdTemp.password" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPwdVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, addUsers, deleteUsers, updateUsers, getRoles, getRolesPermissions, updateRolesPermissions} from '@/api/user'
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
      tableKey: 0,
      list: [],
      total: 0,
      loading: false,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      roleList: [],
      temp: {
        employeeId: '',
        userName: '',
        password: '',
        roleId: ''
      },
      pwdTemp: {
        userId: '',
        password: '',
      },
      dialogFormVisible: false,
      dialogPwdVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      rules: {
        // departName: [{ required: true, message: '部门为必填', trigger: 'blur' }],
        employeeId: [{ required: true, message: '用户名为必填', trigger: 'blur' }],
        userName: [{ required: true, message: '姓名为必填', trigger: 'blur' }],
        role: [{ required: true, message: '角色为必填', trigger: 'change' }],
        password: [{ required: true, message: '密码为必填', trigger: 'blur' }, { min: 6, message: '最少输入6位密码', trigger: 'blur' }]
      },
      pwdRules: {
        password: [{ required: true, message: '密码为必填', trigger: 'blur' }, { min: 6, message: '最少输入6位密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.data
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
        employeeId: '',
        userName: '',
        password: '',
        roleId: ''
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
          addUsers(this.temp).then((res) => {
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
      this.temp.userId = row.userId
      this.temp.employeeId = row.employeeId
      this.temp.roleId = row.roleId
      this.temp.userName = row.userName

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete this.temp.password
          updateUsers(this.temp).then((res) => {
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
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
          deleteUsers(row.userId).then(() => {
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
    getRoles () {
      getRoles().then(res => {
        this.roleList = res.data
      })
    },
    resetPassword (row) {
      this.pwdTemp.userId = row.userId
      this.dialogPwdVisible = true
    },
    confirmPassword () {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          updateUsers(this.pwdTemp).then((res) => {
            this.dialogPwdVisible = false
            this.$notify({
              title: '成功',
              message: '重置密码成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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

