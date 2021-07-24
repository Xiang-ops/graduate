<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" class="handle-input mr10" size="mini" placeholder="根据菜单名字搜索"></el-input>
      </div>
      <el-table ref="multipleTable" size="mini" border style="width: 100%" height="550px" :data="data" @selection-change="handleSelectionChange" @row-click="handleChangeCash">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="订单号" width="110" align="center" prop="number"></el-table-column>
        <el-table-column label="菜单名字" align="center" prop="menuName"></el-table-column>
        <el-table-column prop="clientName" label="用户昵称" width="150" align="center"></el-table-column>
        <el-table-column prop="price" label="总价" width="120" align="center"></el-table-column>
        <el-table-column prop="menuTime" label="取餐时间" width="120" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机尾号" width="120" align="center"></el-table-column>
        <el-table-column label="是否兑现" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain>{{changeOrder(scope.row.isCash) }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="下单日期" width="150" align="center" prop="date"></el-table-column>
        <!-- <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column> -->
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
import { getAllOrder, deleteSinger, updateOrderCash } from '../api/index'

export default {
  name: 'order-page',
  mixins: [mixin],
  data () {
    return {
      tableData: [],
      tempDate: [],
      multipleSelection: [],
      centerDialogVisible: false,
      editVisible: false,
      delVisible: false,
      select_word: '',
      pageSize: 5, // 页数
      currentPage: 1, // 当前页
      idx: -1
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
    // 改变状态
    handleChangeCash (row) {
      console.log('row=========>', row)
      let params = new URLSearchParams()
      params.append('id', row.id)
      params.append('isCash', 1)
      updateOrderCash(params).then((res) => {
        console.log(res)
        if (res.code === 1) {
          this.getData()
          this.notify('修改成功', 'success')
        } else {
          this.notify('更新失败', 'fail')
        }
      })
    },
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 获取歌手
    getData () {
      this.tableData = []
      this.tempDate = []
      getAllOrder().then(res => {
        if (res.length > 0) {
          res.forEach(element => {
            element.phone = element.phone.slice(-4)
          })
        }
        console.log('获取到的订单信息=========》', res)
        this.tableData = res
        this.tempDate = res
        this.currentPage = 1
      })
    },
    // 确定删除
    deleteRow () {
      deleteSinger(this.idx)
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
    },
    songEdit (id, name) {
      this.$router.push({path: `/song`, query: {id: id, name: name}})
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
