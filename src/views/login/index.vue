<template>
  <div class="login-container" :style="{'background': 'url('+ baseUrl + loginData.bgImg +')'}">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          {{loginData.name}}
        </h3>
      </div>
      <el-form-item prop="employeeId">
        <span class="svg-container">
          <svg-icon icon-class="icon-users" />
        </span>
        <el-input
          v-model="loginForm.employeeId"
          placeholder="用户名"
          name="employeeId"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="svg-container" @click="showPwd" style="margin-right: 10px;">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;background-color: rgba(37, 38, 39, 0.7);border: none; height: 45px;" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form>
    <div v-if="loginData.logo" class="login-logo">
      <img :src="baseUrl + loginData.logo" class="login-banner" alt="">
    </div>
    <div v-if="loginData.qrCode" class="wechar-qrcode">
      <img :src="baseUrl + loginData.qrCode" alt="">
    </div>
   
     <p class="copyright">
      Copyright © 2018 湖南车路协同智能科技有限公司 地址：湖南省长沙县经济开发区湘商世纪鑫城32楼 备案号：
      <a href="http://www.beian.miit.gov.cn" target="_blank">湘ICP备19014375号-1</a>
    </p>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { getLoginConfig } from '@/api/user'
export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入用户名！'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码最少输入6位！'))
      } else {
        callback()
      }
    }
    return {
      baseUrl: process.env.BASE_API + '/services',
      loginForm: {
        employeeId: '',
        password: ''
      },
      loginRules: {
        // userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loginData: {},
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  created() {
    this.getLoginConfig()
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    getLoginConfig () {
      getLoginConfig().then(res => {
        this.loginData = res.data
      })
    },
    handleLogin() {
      // this.$router.push('/')
      // return
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-form-item__content {
      display: flex;
    }
    .icon {
      padding: 6px 5px 6px 15px;
      color: #fff;
      vertical-align: middle;
      width: 30px;
      margin-top: 10px;
      &.icon-eye {
        width: 25px;
        margin-right: 10px;
      }
    }
    .el-input {
      height: 47px;
      flex: 1;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      position: relative;
    }
  }
  .login-foot {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;

    .login-vison, .hotline {
      color: #fff;
      font-size: 12px;
      padding-left: 20px;
    }
  }
  .login-logo {
    position: absolute;
    right: 200px;
    bottom: 20px;
    width: 150px;
    img {
      width: 100%;
    }
  }
  .wechar-qrcode {
    width: 150px;
    position: absolute;
    bottom: 20px;
    right: 20px;
    img {
      width: 100%;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-left {
    text-align: right;
    .login-banner {
      width: 100%;
      max-width: 400px;
      margin-top: 180px;
    }
  }

  .login-form {
    // position: absolute;
    // left: 0;
    // right: 0;
    width: 400px;
    max-width: 100%;
    padding: 50px 35px 65px 35px;
    margin: 180px auto;
    background: rgba(45, 58, 75, .3);
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
    .copyright {
    position: fixed;
    bottom: 10px;
    left: 20%;
    padding-right: 200px;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
