<template>
<div class="container">
    <div class="shopContainer">
        <el-form ref="form" :model="shopInfo" label-width="80px">
            <el-form-item label="店铺名称">
                <el-input v-model="shopInfo.shopName"></el-input>
            </el-form-item>
            <el-form-item label="店铺图片">
                <img class="shopPic" :src="getUrl()" />
               <el-upload
                  class="upload-demo"
                  :action="uploadUrl()"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="mini" type="primary">更新图片</el-button>
                </el-upload>
                <!-- <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="营业时间">
                <el-input v-model="shopInfo.businessTime" disabled></el-input>
                <el-button @click.prevent="updateTime(domain)">修改</el-button>
                <!-- <el-col :span="11"> -->
                <!-- <el-time-picker placeholder="开始时间" v-model="shopInfo.timeStart" style="width: 100%;"></el-time-picker> -->
                <!-- </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                <el-time-picker placeholder="结束时间" v-model="shopInfo.timeEnd" style="width: 100%;"></el-time-picker>
                </el-col> -->
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="shopInfo.linkPhone"></el-input>
            </el-form-item>
            <el-form-item label="店铺简介">
                <el-input type="textarea" v-model="shopInfo.shopIntro"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>

        <!-- 编辑营业时间 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
          <el-form ref="form" v-model="shopInfo">
            <el-form-item label="开始时间">
              <el-time-picker v-model="timeStart"></el-time-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-time-picker v-model="timeEnd"></el-time-picker>
            </el-form-item>
          </el-form>
          <span slot="footer"  class="dialog-footer">
            <el-button size="mini" @click="editVisible = false">取 消</el-button>
            <el-button type="primary" size="mini" @click="saveEdit">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</div>
</template>
<script>
import {mixin} from '../mixins'
import { getShopInfo, submitShopInfo } from '../api/index'

export default {
  name: 'shop-page',
  mixins: [mixin],
  data () {
    return {
      // form: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: ''
      // },
      fileUrl: '',
      timeStart: '',
      timeEnd: '',
      shopInfo: {},
      editVisible: false
    }
  },
  watch: {

  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      getShopInfo().then(res => {
        console.log('商家信息======》', res)
        if (res.code === 1) {
          if (res.data.timeStart && res.data.timeEnd) {
            res.data.businessTime = res.data.timeStart + '-' + res.data.timeEnd
          }
          this.shopInfo = res.data
          this.fileUrl = res.data.shopPic
        }
      })
    },
    onSubmit () {
      let params = new URLSearchParams()
      params.append('id', this.shopInfo.id)
      params.append('shopIntro', this.shopInfo.shopIntro)
      params.append('longitude', this.shopInfo.longitude)
      params.append('latitude', this.shopInfo.latitude)
      params.append('address', this.shopInfo.address)
      params.append('timeStart', this.shopInfo.timeStart)
      params.append('timeEnd', this.shopInfo.timeEnd)
      params.append('monthSales', this.shopInfo.monthSales)
      params.append('linkPhone', this.shopInfo.linkPhone)
      params.append('shopPic', this.fileUrl)
      params.append('shopName', this.shopInfo.shopName)

      submitShopInfo(params).then(res => {
        console.log(res)
        if (res.code === 1) { this.notify('修改成功', 'success') } else { this.notify('修改失败', 'error') }
      })
      console.log('submit!')
    },
    getUrl () {
      return `${this.$store.state.HOST}${this.fileUrl}`
    },
    uploadUrl () {
      return `${this.$store.state.HOST}/menu/picture/update`
    },
    handleAvatarSuccess (res) {
      console.log('结果=====》', res)
      this.fileUrl = res.url
      this.shopInfo.shopPic = this.fileUrl
    },
    beforeAvatarUpload (file) {
      console.log('file======>', file)
      console.log('图片路径======>', this.getUrl())
      // return false
    },
    updateTime () {
      this.editVisible = true
    },
    saveEdit () {
      // eslint-disable-next-line no-extend-native
      Date.prototype.Format = function (fmt) {
        var o = {
          'M+': this.getMonth() + 1, // 月份
          'd+': this.getDate(), // 日
          'h+': this.getHours(), // 小时
          'm+': this.getMinutes(), // 分
          's+': this.getSeconds(), // 秒
          'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
          'S': this.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt
      }
      let startTime = new Date(this.timeStart).Format('hh:mm')
      let endTime = new Date(this.timeEnd).Format('hh:mm')
      this.shopInfo.timeStart = startTime
      this.shopInfo.timeEnd = endTime
      this.shopInfo.businessTime = `${startTime}-${endTime}`
      this.editVisible = false
    }
  }
}
</script>
<style scoped>
.shopContainer{
    width: 700px;
    margin: 10px auto;
}
.shopPic{
  width: 178px;
  height: 178px;
}
</style>
