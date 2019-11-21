<template>
  <!-- 网点 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input placeholder="账号" v-model="listQuery.username" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="" v-model="listQuery.employeeId" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="手机" v-model="listQuery.mobile" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">添加网点</el-button>
    </div>

    <el-table
      v-loading="loading"
      :key="tableKey"
      :data="list"
      border
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'网点编号'" prop="no"></el-table-column>
      <el-table-column :label="'网点名称'" prop="name"></el-table-column>
      <el-table-column :label="'类型'" prop="posititionTypeId">
        <template slot-scope="scope">
          <div v-for="(item, i) in posititionTypeList" :key="i" v-if="item.posititionTypeId == scope.row.posititionTypeId">{{item.name}}</div>
        </template>
      </el-table-column>
      <el-table-column :label="'归属单位'" prop="unit"></el-table-column>
      <el-table-column :label="'网点区域'" prop="provinceName">
        <template slot-scope="scope">
          <div>{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="'IP: 端口'" prop="ip">
        <template slot-scope="scope">
          <div>{{scope.row.ip}}{{scope.row.port}}</div>
        </template>
      </el-table-column> -->
      <el-table-column :label="'经度'" prop="geoLongitude"></el-table-column>
      <el-table-column :label="'纬度'" prop="geoLatitude"></el-table-column>
      <el-table-column :label="'操作'" align="center" fixed="right" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" style="width:85px" @click="handleCameras(scope.row)">摄像头管理</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'网点编号'" prop="no">
          <el-input v-model="temp.no"/>
        </el-form-item>
        <el-form-item :label="'网点名称'" prop="name" >
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="'区域'" prop="provinceId">
          <el-select v-model="temp.provinceId" placeholder="省" style="width: 90px" @change="changeProvince()">
            <el-option
              v-for="item in provinceList"
              :key="item.geoId"
              :label="item.geoName"
              :value="item.geoId">
            </el-option>
          </el-select>
          <el-select v-model="temp.cityId" placeholder="市" style="width: 90px" @change="changeCity()">
            <el-option
              v-for="item in cityList"
              :key="item.geoId"
              :label="item.geoName"
              :value="item.geoId">
            </el-option>
          </el-select>
          <el-select v-model="temp.countyID" placeholder="区" style="width: 90px">
            <el-option
              v-for="item in countyList"
              :key="item.geoId"
              :label="item.geoName"
              :value="item.geoId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'归属单位'" prop="unit">
          <el-input v-model="temp.unit"/>
        </el-form-item>
        <!-- <el-form-item :label="'网点IP'" prop="ip">
          <el-input v-model="temp.ip"/>
        </el-form-item>
        <el-form-item :label="'端口'" prop="port">
          <el-input v-model.number="temp.port"/>
        </el-form-item> -->
        <el-form-item :label="'经度'" prop="geoLongitude">
          <el-input v-model="temp.geoLongitude"/>
        </el-form-item>
        <el-form-item :label="'纬度'" prop="geoLatitude">
          <el-input v-model="temp.geoLatitude"/>
        </el-form-item>
        <el-form-item :label="'网点类型'" prop="geoLatitude">
          <el-select v-model="temp.posititionTypeId" placeholder="网点类型">
            <el-option
              v-for="item in posititionTypeList"
              :key="item.posititionTypeId"
              :label="item.name"
              :value="item.posititionTypeId">
            </el-option>
          </el-select>
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
import { getPosititions, addPosititions, deletePosititions, updatePosititions, getGeos, getPosititionsLabel, addPosititionsLabel, deletePosititionsLabel, getPosititiontypes } from '@/api/api'
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
      loading: true,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      roleList: [],
      temp: {
        no: '',
        cityId: '',
        cityName: '',
        countyID: '',
        countyName: '',
        geoLatitude: '',
        geoLongitude: '',
        // ip: '',
        name: '',
        // port: '',
        provinceId: '',
        provinceName: '',
        unit: '',
        posititionTypeId: ''
      },
      countyList: [],
      cityList: [],
      provinceList: [],
      labelList: [],
      posititionTypeList: [],
      dialogFormVisible: false,
      dialogLabelVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑网点',
        create: '新增网点'
      },
      rules: {
        name: [{ required: true, message: '网点位置名称为必填', trigger: 'blur' }],
        no: [{ required: true, message: '编号为必填', trigger: 'blur' }],
        countyID: [{ required: true, message: '区为必填', trigger: 'change' }],
        cityId: [{ required: true, message: '市为必填', trigger: 'change' }],
        provinceId: [{ required: true, message: '省区为必填', trigger: 'change' }],
        // ip: [{ required: true, message: '网点IP为必填', trigger: 'blur' }],
        // port: [{ required: true, message: '端口为必填', trigger: 'blur' }],
        geoLatitude: [{ required: true, message: '纬度为必填', trigger: 'blur' }],
        geoLongitude: [{ required: true, message: '经度为必填', trigger: 'blur' }],
        unit: [{ required: true, message: '归属单位为必填', trigger: 'blur' }],
        posititionTypeId: [{ required: true, message: '网点类型为必填', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getGeos(100000, 'province')
    this.getPosititiontypes()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true
      getPosititions(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        // Just to simulate the time of the request
        this.loading = false
      }).catch(error => console.error(error))
    },
    changeProvince () {
      this.cityList = []
      this.temp.cityId = ''
      this.temp.countyID = ''
      this.countyList = []
      this.getGeos(this.temp.provinceId, 'city')
    },
    changeCity () {
      this.temp.countyID = ''
      this.countyList = []
      this.getGeos(this.temp.cityId, 'county')
    },
    getGeos (id, type) {
      getGeos(id).then(res => {
        if (type === 'province') {
          this.provinceList = res.data
        } else if (type === 'city') {
          this.cityList = res.data
        } else if (type === 'county') {
          this.countyList = res.data
        }
      })
    },
    // 过滤列表数据 
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        no: '',
        cityId: '',
        countyID: '',
        geoLatitude: '',
        geoLongitude: '',
        ip: '',
        name: '',
        no: '',
        port: '',
        provinceId: '',
        unit: '',
        posititionTypeId: ''
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
      this.provinceList.forEach(item => {
        if (item.geoId === this.temp.provinceId) this.temp.provinceName = item.geoName
      })
      this.cityList.forEach(item => {
        if (item.geoId === this.temp.cityId) this.temp.cityName = item.geoName
      })
      this.countyList.forEach(item => {
        if (item.geoId === this.temp.countyID) this.temp.countyName = item.geoName
      })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addPosititions(this.temp).then((res) => {
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
      this.temp.no = row.no
      
      this.temp.geoLatitude = row.geoLatitude
      this.temp.geoLongitude = row.geoLongitude
      this.temp.posititionTypeId = row.posititionTypeId
      this.temp.ip = row.ip
      this.temp.name = row.name
      this.temp.port = row.port
      this.temp.provinceId = row.provinceId
      // this.getGeos(100000, 'province')
      this.temp.provinceName = row.provinceName
      this.getGeos(row.provinceId, 'city')
      this.temp.cityId = row.cityId
      this.temp.cityName = row.cityName
      this.getGeos(row.cityId, 'county')
      this.temp.countyID = row.countyID
      this.temp.countyName = row.countyName
      this.temp.unit = row.unit
      this.temp.posititionId = row.posititionId
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.provinceList.forEach(item => {
        if (item.geoId === this.temp.provinceId) this.temp.provinceName = item.geoName
      })
      this.cityList.forEach(item => {
        if (item.geoId === this.temp.cityId) this.temp.cityName = item.geoName
      })
      this.countyList.forEach(item => {
        if (item.geoId === this.temp.countyID) this.temp.countyName = item.geoName
      })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePosititions(this.temp).then((res) => {
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
      this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
          deletePosititions(row.posititionId).then(() => {
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
    handleCameras (row) {
      this.$router.push('/site/cameras?id=' + row.posititionId)
    },
    getPosititiontypes () {
      getPosititiontypes().then(res => {
        this.posititionTypeList = res.data
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
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

