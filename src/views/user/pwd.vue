<template>
  <div class="app-container">

    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'原密码'" prop="oldPwd">
          <el-input v-model="temp.oldPwd" type="password"/>
        </el-form-item>
        <el-form-item :label="'新密码'" prop="password" >
          <el-input v-model="temp.password" type="password"/>
        </el-form-item>
        <el-form-item :label="'确认密码'" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" type="password"/>
        </el-form-item>
      </el-form>
      <div class="form-foot">
        <el-button type="primary" @click="updateData()">保存</el-button>
      </div>
  </div>
</template>

<script>
import { updatePasswrod } from '@/api/user'

export default {
  data () {
    return {
      temp: {
        oldPwd: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        oldPwd: [{ required: true, message: '原密码必填', trigger: 'blur'}],
        password: [{ required: true, message: '新密码必填', trigger: 'blur'}],
        confirmPassword: [{ required: true, message: '确认密码必填', trigger: 'blur'}]
      }
    }
  },
  methods: {
    updateData () {
      updatePasswrod(this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.$router.push('/')
      }).catch(err => console.error(err))
    }
  }
}
</script>





