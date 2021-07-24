<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选相关菜品类型" class="handle-input mr10"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加新菜品类型</el-button>
      </div>
      <el-table :data="data" border size="mini" style="width: 100%" ref="multipleTable" height="550px" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="菜品类型" prop="mtype" width="80" align="center"></el-table-column>
        <el-table-column label="菜品类型名称" prop="name" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="total, prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="tableData.length">
        </el-pagination>
      </div>
    </div>

    <!--添加新菜品-->
    <el-dialog title="添加菜品类型" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="菜品类型" prop="mtype" size="mini">
          <el-input v-model="registerForm.mtype" placeholder="菜品类型"></el-input>
        </el-form-item>
        <el-form-item label="菜品类型名称" prop="name" size="mini">
          <el-input placeholder="菜品类型名称" v-model="registerForm.name"></el-input>
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
        <el-button size="mini" type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../mixins'
import { setMenuType, getAllMenuType, deleteMenuType } from '../api/index'

export default {
  name: 'menutype-page',
  mixins: [mixin],
  data () {
    return {
      picUrl: '', // 获取数据库的地址
      registerForm: { // 注册
        name: '',
        mtype: ''
      },
      rules: {
        mtype: [
          { required: true, trigger: 'blur' }
        ],
        name: [
          { required: true, trigger: 'blur', message: '请输入菜单类型名称' }
        ]
      },
      options: [],
      tableData: [], // 记录用户信息，用于显示
      tempDate: [], // 记录用户信息，用于搜索时能临时记录一份用户信息
      is_search: false,
      multipleSelection: [], // 记录要删除的用户信息
      centerDialogVisible: false,
      editVisible: false, // 显示编辑框
      delVisible: false, // 显示删除框
      select_word: '', // 记录输入框输入的内容
      pageSize: 5, // 页数
      currentPage: 1, // 当前页
      idx: -1 // 记录当前点中的行
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
          if (item.name.includes(this.select_word)) {
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
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 获取用户信息
    getData () {
      this.tableData = []
      this.tempDate = []
      getAllMenuType().then((res) => {
        this.tableData = res
        this.tempDate = res
        this.currentPage = 1
      })
    },
    // 添加菜品
    addMenu () {
      let params = new URLSearchParams()
      params.append('name', this.registerForm.name)
      params.append('mtype', this.registerForm.mtype)
      setMenuType(params)
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
    // 确定删除
    deleteRow () {
      deleteMenuType(this.idx)
        .then(res => {
          if (res) {
            this.getData()
            this.notify('删除成功', 'success')
          } else {
            this.notify('删除失败', 'error')
          }
        })
        .catch(failResponse => {})
      this.delVisible = false
    }
  }
}

</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
  font-size: 12px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.pagination {
  display: flex;
  justify-content: center;
}
</style>
