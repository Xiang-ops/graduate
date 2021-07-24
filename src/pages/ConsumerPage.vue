<template>
  <div class="table">
    <div class="container">
      <el-table :data="data" stripe size="mini" style="width: 100%" ref="multipleTable" height="550px">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="编号" prop="idNumber" width="80" align="center"></el-table-column>
        <el-table-column label="用户头像" width="250" align="center" prop="avatar">
           <!-- prop="avatar" -->
          <template slot-scope="scope">
            <img :src="scope.row.avatar" alt="" style="width: 30px;"/>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="username" width="100" align="center"></el-table-column>
        <el-table-column label="手机号码" prop="phone"  align="center"></el-table-column>
        <el-table-column label="金币数目" prop="gold" width="100" align="center"></el-table-column>
         <el-table-column label="是否为会员" width="120" align="center" prop="isMember"></el-table-column>
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
  </div>
</template>

<script>
import { mixin } from '../mixins'
import { getAllUser } from '../api/index'

export default {
  name: 'consumer-page',
  mixins: [mixin],
  data () {
    return {
      registerForm: { // 注册
        username: '',
        password: '',
        sex: '',
        phoneNum: '',
        email: '',
        birth: '',
        introduction: '',
        location: ''
      },
      cities: [{
        value: '北京',
        label: '北京'
      }, {
        value: '天津',
        label: '天津'
      }, {
        value: '河北',
        label: '河北'
      }, {
        value: '山西',
        label: '山西'
      }, {
        value: '内蒙古',
        label: '内蒙古'
      }, {
        value: '辽宁',
        label: '辽宁'
      }, {
        value: '吉林',
        label: '吉林'
      }, {
        value: '黑龙江',
        label: '黑龙江'
      }, {
        value: '上海',
        label: '上海'
      }, {
        value: '江苏',
        label: '江苏'
      }, {
        value: '浙江',
        label: '浙江'
      }, {
        value: '安徽',
        label: '安徽'
      }, {
        value: '福建',
        label: '福建'
      }, {
        value: '江西',
        label: '江西'
      }, {
        value: '山东',
        label: '山东'
      }, {
        value: '河南',
        label: '河南'
      }, {
        value: '湖北',
        label: '湖北'
      }, {
        value: '湖南',
        label: '湖南'
      }, {
        value: '广东',
        label: '广东'
      }, {
        value: '广西',
        label: '广西'
      }, {
        value: '海南',
        label: '海南'
      }, {
        value: '重庆',
        label: '重庆'
      }, {
        value: '四川',
        label: '四川'
      }, {
        value: '贵州',
        label: '贵州'
      }, {
        value: '云南',
        label: '云南'
      }, {
        value: '西藏',
        label: '西藏'
      }, {
        value: '陕西',
        label: '陕西'
      }, {
        value: '甘肃',
        label: '甘肃'
      }, {
        value: '青海',
        label: '青海'
      }, {
        value: '宁夏',
        label: '宁夏'
      }, {
        value: '新疆',
        label: '新疆'
      }, {
        value: '香港',
        label: '香港'
      }, {
        value: '澳门',
        label: '澳门'
      }, {
        value: '台湾',
        label: '台湾'
      }],
      rules: {
        username: [
          { required: true, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phoneNum: [
          { essage: '请选择日期', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        birth: [
          { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        introduction: [
          { message: '请输入介绍', trigger: 'blur' }
        ],
        location: [
          { message: '请输入地区', trigger: 'change' }
        ]
      },
      tableData: [], // 记录用户信息，用于显示
      tempDate: [], // 记录用户信息，用于搜索时能临时记录一份用户信息
      is_search: false,
      multipleSelection: [], // 记录要删除的用户信息
      centerDialogVisible: false,
      editVisible: false, // 显示编辑框
      delVisible: false, // 显示删除框
      select_word: '', // 记录输入框输入的内容
      form: { // 记录编辑的信息
        id: '',
        username: '',
        password: '',
        sex: '',
        phoneNum: '',
        email: '',
        birth: '',
        introduction: '',
        location: '',
        createTime: '',
        updateTime: ''
      },
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
          if (item.username.includes(this.select_word)) {
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
    uploadUrl (id) {
      return `${this.$store.state.HOST}/user/avatar/update?id=${id}`
    },
    // 获取用户信息
    getData () {
      this.tableData = []
      this.tempDate = []
      getAllUser().then((res) => {
        this.tableData = res
        this.tableData.forEach((element, index) => {
          console.log(element.avatar)
          element.idNumber = index + 1
          if (element.isMember === 0) {
            this.tableData[index].isMember = '否'
          } else {
            this.tableData[index].isMember = '是'
          }
          console.log(element)
        })
        this.tempDate = res
        this.currentPage = 1
      })
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
