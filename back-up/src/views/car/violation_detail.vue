<template>
  <!-- 违章详情 -->
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="violation-detail"><label>车牌</label><span>{{data.plateNo}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="violation-detail"><label>违章抓拍点</label><span>{{data.positition ? data.positition.name : ''}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="violation-detail"><label>违章原因</label><span>{{data.reason}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="violation-detail"><label>违章时间</label><span>{{data.time}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="violation-detail"><label>车速</label><span>{{data.speed}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="violation-detail"><label>违章编码</label><span>{{data.carsFlowId}}</span></div>
      </el-col>
      <el-col :span="12">
        <div class="violation-detail"><label>限速</label><span>{{data.limitSpeed}}</span></div>
      </el-col>
      <el-col :span="12">
        
      </el-col>
    </el-row>
    <h2 style="margin-top: 30px; margin-bottom: 15px;">抓拍图片</h2>
    <el-row :gutter="20" style="    display: flex; flex-flow: row;">
      <!-- <el-col :span="12" style="margin-bottom: 15px; display: flex; flex: 1; align-items: center;justify-content: center; background: #f5f5f5; margin-right: 10px;">
        <img preview="0" src="@/assets/trace3.jpeg" alt="" style="max-width: 100%;">
      </el-col> -->
      <el-col :span="12" v-if="data.images" v-for="(item, key) in data.images" :key="key" style="margin-bottom: 15px; display: flex; flex: 1; align-items: center;justify-content: center; background: #f5f5f5; margin-right: 10px;">
        <img title="查看大图" preview="0" :src="baseUrl + '/images/' + getImageTime(item.imagesTime) + '/' + item.imagesId + '.' + item.imagesType" alt="" style="max-width: 100%; cursor: pointer;">
      </el-col>
    </el-row>
    <!-- <el-dialog class="top" title="" :show-close="false" :visible.sync="dialogImageVisible">
      <div class="image-view" style="display: flex; align-items: center;justify-content: center; background: #f5f5f5; padding: 20px; min-height: 500px;">
        <img :src="bigImage" alt="" style="max-width: 100%;">
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { gethCarFlowDetail } from '@/api/api'
export default {
  data () {
    return {
      carFlowId: '',
      data: {},
      bigImage: '',
      baseUrl: process.env.BASE_API + '/services',
      // dialogImageVisible: false,
    }
  },
  created () {
    if (this.$route.query.id) {
      this.carFlowId = this.$route.query.id
      this.getData()
    }
  },
  methods: {
    getData () {
      gethCarFlowDetail(this.carFlowId).then(res => {
        this.data = res.data
      })
    },
    getImageTime (val) {
      console.log(val)
      if (!!val) {
        let date = val.split(' ')[0]
        date = date.replace('-', '')
        date = date.replace('-', '')
        return date
      } else {
        return ''
      }
    }
    // viewBigImage (img) {
    //   this.dialogImageVisible = true
    //   this.bigImage = img
    // }
  }
}
</script>

<style lang="scss">
.violation-detail {
  display: flex;
  margin-bottom: 15px;
  height: 25px;
    line-height: 25px;
  label {
    width: 180px;
    text-align: right;
    flex: 1;
    display: block;
    font-size: 14px;
    color: #333;
    
  }
  span {
    flex: 1;
    display: block;
    color: #666;
    margin-left: 10px;
  }
  
}
.el-dialog__wrapper {
  &.top {
    .el-dialog {
      margin-top: 10px !important;
      .el-dialog__header {
        display: none;
      }
    }
  }
}

</style>
