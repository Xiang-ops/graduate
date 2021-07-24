<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" class="handle-input mr10" size="mini" placeholder="根据菜单名字搜索"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加优惠券</el-button>
      </div>
      <el-table ref="multipleTable" size="mini" border style="width: 100%" height="550px" :data="data" @selection-change="handleSelectionChange">
        <el-table-column width="70">
            <template>
                <img src="../assets/img/coupon.png" style="width:40px;height:40px">
            </template>
        </el-table-column>
        <el-table-column label="优惠券满价" width="110" align="center" prop="hreshold"></el-table-column>
        <el-table-column label="优惠券减价" align="center" prop="subPrice"></el-table-column>
        <el-table-column prop="point" label="所需积分" width="150" align="center"></el-table-column>
        <el-table-column prop="endDate" label="失效日期" width="120" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="tableData.length"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
<!-- 添加优惠券 -->
   <el-dialog title="添加优惠券" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="优惠券满价" prop="hreshold" size="mini">
          <el-input v-model="registerForm.hreshold" placeholder="优惠券满价"></el-input>
        </el-form-item>
        <el-form-item label="满减价格" prop="subPrice" size="mini">
          <el-input type="number" placeholder="满减价格" v-model="registerForm.subPrice"></el-input>
        </el-form-item>
        <el-form-item label="截止日期">
           <el-date-picker
            v-model="endDatevalue1"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所需积分" prop="point" size="mini">
          <el-input  type="number" placeholder="所需积分" v-model="registerForm.point" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt" align="center">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="delVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../mixins'
import { getCouponInfo, deleteCoupon, setCoupon } from '../api/index'

export default {
  name: 'coupon-page',
  mixins: [mixin],
  data () {
    return {
      tableData: [],
      tempDate: [],
      endDatevalue1: '',
      multipleSelection: [],
      centerDialogVisible: false,
      editVisible: false,
      delVisible: false,
      select_word: '',
      pageSize: 5, // 页数
      currentPage: 1, // 当前页
      idx: -1,
      registerForm: { // 注册
        hreshold: '',
        subPrice: '',
        endDate: '',
        point: ''
      },
      rules: {
        hreshold: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 计算当前表格中的数据
    data () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  watch: {
    select_word: function () {
      if (this.select_word === '') {
        this.tableData = this.tempDate
      } else {
        this.tableData = []
        for (let item of this.tempDate) {
          if (item.menuName.includes(this.select_word)) {
            this.tableData.push(item)
          }
        }
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    changeOrder (value) {
      if (value === 0) { return '未兑现' }
      if (value === 1) { return '已兑现' }
      if (value === 2) { return '已完成' }
    },
    addMenu () {
      // eslint-disable-next-line no-extend-native
      Date.prototype.Format = function (fmt) {
        var o = {
          'Y+': this.getFullYear(),
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
      let params = new URLSearchParams()
      params.append('hreshold', this.registerForm.hreshold)
      params.append('subPrice', this.registerForm.subPrice)
      params.append('endDate', new Date(this.endDatevalue1).Format('YYYY-MM-dd'))
      params.append('point', this.registerForm.point)
      console.log('this.registerForm=========>', this.registerForm)
      console.log('endDatevalue1', new Date(this.endDatevalue1).Format('YYYY-MM-dd'))
      setCoupon(params)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.registerForm = {}
            this.notify('添加成功', 'success')
          } else {
            this.notify('添加失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.centerDialogVisible = false
    },
    // // 改变状态
    // handleChangeCash (row) {
    //   console.log('row=========>', row)
    //   let params = new URLSearchParams()
    //   params.append('id', row.id)
    //   params.append('isCash', 1)
    //   updateOrderCash(params).then((res) => {
    //     console.log(res)
    //     if (res.code === 1) {
    //       this.getData()
    //       this.notify('修改成功', 'success')
    //     } else {
    //       this.notify('更新失败', 'fail')
    //     }
    //   })
    // },
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 获取优惠券
    getData () {
      this.tableData = []
      this.tempDate = []
      getCouponInfo().then(res => {
        this.tableData = res.allCoupon
        this.tempDate = res.allCoupon
        this.currentPage = 1
      })
    },
    // 确定删除
    deleteRow () {
      deleteCoupon(this.idx)
        .then(res => {
          if (res) {
            this.getData()
            this.notify('删除成功', 'success')
          } else {
            this.notify('删除失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.delVisible = false
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.singer-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}

.pagination {
  display: flex;
  justify-content: center;
}
</style>
