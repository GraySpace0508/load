<template>
  <div class="app-container">

    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="140px" style="width: 500px; margin-left:50px;">
        <el-form-item :label="'系统名称'" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="'平台Logo'" prop="logo" >
          <el-upload
            class="avatar-uploader"
            :action="'/services/images'"
            :headers="headers"
            :show-file-list="false"
            :on-success="logoSuccess"
            :before-upload="beforeBannerBgUpload">
            <img v-if="temp.logo" :src="baseUrl + temp.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="loginpage-tip">说明: 为了显示效果，请使用png类型的图片</div>
        </el-form-item>
        <el-form-item :label="'登录页面背景图片'" prop="confirmPassword">
          <el-upload
            class="avatar-uploader"
            :action="'/services/images'"
            :headers="headers"
            :show-file-list="false"
            :on-success="bgImgSuccess"
            :before-upload="beforebgImgUpload">
            <img v-if="temp.bgImg" :src="baseUrl + temp.bgImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="loginpage-tip">说明:   建议图片的规格为: 1920*1080</div>
        </el-form-item>
        <el-form-item :label="'公众号二维码'" prop="confirmPassword">
          <el-upload
            class="avatar-uploader"
            :action="'/services/images'"
            :headers="headers"
            :show-file-list="false"
            :on-success="wechatSuccess"
            :before-upload="beforeWechatUpload">
            <img v-if="temp.qrCode" :src="baseUrl + temp.qrCode" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="'透明度'" prop="clear">
          <el-input v-model.number="temp.clear"/>
          <div class="loginpage-tip">说明:   0~100, 100为全透明</div>
        </el-form-item>
      </el-form>
      <div class="form-foot">
        <el-button type="primary" @click="updateLoginConfig">保存</el-button>
      </div>
  </div>
</template>

<script>
import { getLoginConfig, updateLoginConfig } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  data () {
    return {
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      baseUrl: process.env.BASE_API + '/services',
      temp: {
        name: '',
        bgImg: '',
        logo: '',
        qrCode: '',
        clear: ''
      },
      rules: {
        name: [{ required: true, message: '系统名称必填', trigger: 'blur'}],
        bgImg: [{ required: true, message: '登录页面背景图片必填', trigger: 'blur'}],
        logo: [{ required: true, message: '平台Logo必填', trigger: 'blur'}],
        qrCode: [{ required: true, message: '公众号二维码必填', trigger: 'blur'}],
        clear: [{ required: true, message: '透明度必填', trigger: 'blur'}]
      }
    }
  },
  created() {
    this.getLoginConfig()
  },
  methods: {
     wechatSuccess (res, file) {
      this.temp.qrCode =  res.data.src
    },
    logoSuccess (res, file) {
      this.temp.logo = res.data.src
    },
    bgImgSuccess (res, file) {
      this.temp.bgImg = res.data.src
    },
    beforeWechatUpload (file) {
      // const isImg = file.type === 'image/*';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像只能是 图片!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    beforeBannerBgUpload (file) {
      // const isJPG = file.type === 'image/*';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像只能是 图片!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    beforebgImgUpload (file) {
      // const isJPG = file.type === 'image/*';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像只能是 图片!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    getLoginConfig () {
      getLoginConfig().then(res => {
        this.temp = res.data
      }).catch(err => console.error(err))
    },
    updateLoginConfig () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateLoginConfig(this.temp).then(res => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getLoginConfig()
          })
        }
      })
      
    }
  }
}
</script>

<style>
.loginpage-tip {
  color: #999;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>




