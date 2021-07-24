<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选相关菜品" class="handle-input mr10"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加新菜品</el-button>
      </div>
      <el-table :data="data" border size="mini" style="width: 100%" ref="multipleTable" height="550px" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="菜单图片" width="102" align="center">
          <template slot-scope="scope">
            <img :src="getUrl(scope.row.picture)" alt="" style="width: 80px;"/>
            <!-- <el-upload
              class="upload-demo"
              :action="uploadUrl(scope.row.id)"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <el-button size="mini">更新图片</el-button>
            </el-upload> -->
          </template>
        </el-table-column>
        <el-table-column label="菜品名字" prop="name" width="80" align="center"></el-table-column>
        <el-table-column label="菜品价格" prop="price" width="80" align="center"></el-table-column>
        <el-table-column prop="introduction" label="菜品简要介绍" align="center"></el-table-column>
        <!-- <el-table-column label="规格" width="80" align="center">
            <template  slot-scope="scope">
                <el-button size="mini" @click="getCollect(data[scope.$index].id)">规格</el-button>
            </template>
        </el-table-column> -->
        <el-table-column prop="mtype" label="菜品类型" align="center" width="150"></el-table-column>
        <el-table-column prop="menuSize" label="菜品规格" width="150" align="center">
          <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="handleConditions(scope.row)">添加</el-button>
              <el-button type="primary" plain size="mini" @click="editConditions(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
                <el-button  type="primary" plain size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button  type="danger" plain size="mini"  @click="handleDelete(scope.row.id)">删除</el-button>
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
    <!-- 规格添加框 -->
    <el-dialog title="添加" :visible.sync="viewCondition" width="600px" center>
      <el-form>
          <el-form-item>
              <el-select v-model="condition" placeholder="请选择">
                <el-option
                  v-for="(item,index) in optionsCon"
                  :key="item"
                  :label="item"
                  :value="index">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="conditionValue" placeholder="请输入内容"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="viewCondition = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="addCondition">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 规格编辑框 -->
    <el-dialog title="编辑" :visible.sync="changeCondition" width="600px" center>
      <div>
          <div class="title">
              杯型
          </div>
          <el-tag
            v-for="tag in sizeList"
            :key="tag.content"
            closable
            @close="handleCloseSize(tag)"
          >
            {{tag.content}}
          </el-tag>
          <div class="title">
              温度
          </div>
          <el-tag
            v-for="tag in tempList"
            :key="tag.content"
            closable
            @close="handleCloseTemp(tag)"
          >
            {{tag.content}}
          </el-tag>
          <div class="title">
              甜度
          </div>
          <el-tag
            v-for="tag in sugarList"
            :key="tag.content"
            closable
            @close="handleCloseSugar(tag)"
          >
            {{tag.content}}
          </el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changeCondition = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="changeConditionFunct">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加新菜品-->
    <el-dialog title="添加菜品" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="菜品名字" prop="name" size="mini">
          <el-input v-model="registerForm.name" placeholder="菜品名字"></el-input>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price" size="mini">
          <el-input type="number" placeholder="菜品价格" v-model="registerForm.price"></el-input>
        </el-form-item>
        <el-form-item label="菜品图片">
          <!-- <template slot-scope="scope"> -->
            <img :src="getUrl(picUrl)" alt="" style="width: 80px;"/>
            <el-upload
              class="upload-demo"
              :action="uploadUrl()"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <el-button size="mini">上传图片</el-button>
            </el-upload>
          <!-- </template> -->
        </el-form-item>
        <el-form-item label="菜品简要介绍" prop="introduction" size="mini">
          <el-input  type="textarea" placeholder="简要介绍" v-model="registerForm.introduction" ></el-input>
        </el-form-item>
        <el-form-item label="菜品类型选择" prop="mtype" size="mini">
          <template>
            <el-select v-model="registerForm.mid" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="菜品规格" prop="menuSize" size="mini">
          <template>
            <el-select v-model="registerForm.menuSize" clearable placeholder="请选择">
              <el-option
                v-for="item in sizeValue"
                :key="item.key"
                :label="item.menuSize"
                :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="400px">
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="菜品名称" size="mini">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜品价格" size="mini">
          <el-input v-model="form.price" type="number"></el-input>
        </el-form-item>
         <el-form-item label="菜品图片">
          <!-- <template slot-scope="scope"> -->
            <el-upload
              class="upload-demo"
              :action="uploadUrl()"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <el-button size="mini">上传图片</el-button>
            </el-upload>
          <!-- </template> -->
        </el-form-item>
        <el-form-item label="菜品简要介绍" size="mini">
          <el-input v-model="form.introduction" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="菜品类型选择">
          <template>
            <el-select v-model="form.mid" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
         <el-form-item label="菜品规格" prop="menuSize" size="mini">
          <template>
            <el-select v-model="form.menuSize" clearable placeholder="请选择">
              <el-option
                v-for="item in sizeValue"
                :key="item.key"
                :label="item.menuSize"
                :value="item.key">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveEdit">确 定</el-button>
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
import { setMenu, updateMenuMsg, getAllMenu, deleteMenu, getAllMenuType, updateSize, addConditionFunct, getAllCondition, deleteConditionFunct } from '../api/index'

export default {
  name: 'menu-page',
  mixins: [mixin],
  data () {
    return {
      picUrl: '', // 获取数据库的地址
      registerForm: { // 注册
        name: '',
        picture: '',
        price: '',
        introduction: '',
        mtype: '',
        menuSize: '',
        mid: ''
      },
      changeCondition: false,
      condition: '',
      conditionValue: '',
      conditionList: [],
      optionsCon: ['杯型', '温度', '糖度'],
      options: [],
      sizeValue: [
        {
          key: 0,
          menuSize: '小'
        },
        {
          key: 1,
          menuSize: '中'
        },
        {
          key: 2,
          menuSize: '大'
        },
        {
          key: 3,
          menuSize: '全部'
        }
      ],
      rules: {
        name: [
          { required: true, trigger: 'blur' }
        ]
      },
      tableData: [], // 记录用户信息，用于显示
      tempDate: [], // 记录用户信息，用于搜索时能临时记录一份用户信息
      is_search: false,
      viewCondition: false, // 显示查看规格框的内容
      multipleSelection: [], // 记录要删除的用户信息
      centerDialogVisible: false,
      editVisible: false, // 显示编辑框
      delVisible: false, // 显示删除框
      select_word: '', // 记录输入框输入的内容
      form: { // 记录编辑的信息
        id: '',
        name: '',
        picture: '',
        introduction: '',
        price: '',
        mtype: '',
        mid: ''
      },
      pageSize: 5, // 页数
      updateSize: false,
      currentPage: 1, // 当前页
      idx: -1, // 记录当前点中的行
      sizeList: [],
      tempList: [],
      sugarList: []
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
    this.getMenuType()
  },
  methods: {
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    uploadUrl () {
      return `${this.$store.state.HOST}/menu/picture/update`
    },
    // handleAvatarSuccess (res, file) {
    //   let _this = this
    //   if (res.code === 1) {
    //     _this.imageUrl = URL.createObjectURL(file.raw) //
    //     console.log(_this.imageUrl)
    //     console.log('=====================>', file)
    //     console.log(res)
    //     _this.picUrl = res.url
    //     _this.getData()
    //     _this.$notify({
    //       title: '上传成功',
    //       type: 'success'
    //     })
    //   } else {
    //     _this.$notify({
    //       title: '上传失败',
    //       type: 'error'
    //     })
    //   }
    // },
    // 获取用户信息
    getData () {
      this.tableData = []
      this.tempDate = []
      getAllMenu().then((res) => {
        this.tableData = res
        this.tempDate = res
        this.currentPage = 1
      })
    },
    changeConditionFunct () {

    },
    // 获取规格信息
    editConditions (row) {
      this.sizeList = []
      this.tempList = []
      this.sugarList = []
      let params = new URLSearchParams()
      params.append('goodsId', row.id)
      getAllCondition(params).then(res => {
        console.log('规格信息', res)
        res.forEach((value, index) => {
          // eslint-disable-next-line
          if (value.flagId == 0) {
            this.sizeList.push(value)
          }
          // eslint-disable-next-line
          if (value.flagId == 1) {
            this.tempList.push(value)
          }
          // eslint-disable-next-line
          if (value.flagId == 2) {
            this.sugarList.push(value)
          }
        })
      })
      this.changeCondition = true
    },
    // 获取菜单类型信息
    getMenuType () {
      getAllMenuType().then((res) => {
        console.log('菜品类型======》', res)
        this.options = res
        // res.forEach((element, index) => {
        //   this.options.push(element)
        // })
        console.log('this.options=====>', this.options)
      })
    },

    getCollect (id) {
      this.$router.push({path: '/collect', query: { id }})
    },
    // 添加菜品
    addMenu () {
      let params = new URLSearchParams()
      params.append('name', this.registerForm.name)
      params.append('price', this.registerForm.price)
      params.append('introduction', this.registerForm.introduction)
      params.append('picture', this.picUrl)
      params.append('mtype', this.registerForm.mid)
      params.append('menuSize', this.registerForm.menuSize)
      console.log('this.registerForm=========>', this.registerForm)
      setMenu(params)
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
    // 编辑
    handleEdit (row) {
      this.idx = row.id
      this.form = {
        id: row.id,
        name: row.name,
        price: row.price,
        introduction: row.introduction,
        picture: row.picture,
        mtype: row.mtype,
        menuSize: row.menuSize,
        mid: row.mid
      }
      this.editVisible = true
    },
    handleConditions (row) {
      // eslint-disable-next-line
      if (row.menuSize == 3) {
        this.updateSize = true
      }
      this.conditionId = row.id
      this.viewCondition = true
      console.log('this.updateSize', this.updateSize)
    },
    addCondition () {
      let params = new URLSearchParams()
      console.log('this.updateSize', this.updateSize)
      if (!this.updateSize) {
        console.log('执行了此函数')
        params.append('id', this.conditionId)
        params.append('menuSize', 3)
        updateSize(params)
          .then(res => {
            if (res.code === 1) {
              console.log('成功')
              this.updateSize = true
              this.submitCondition()
            }
          })
      } else {
        this.submitCondition()
      }
    },
    submitCondition () {
      let params = new URLSearchParams()
      params.append('menuId', this.conditionId)
      params.append('flagId', this.condition)
      params.append('condition', this.conditionValue)
      addConditionFunct(params)
        .then(res => {
          if (res.code === 1) {
            this.notify('添加成功', 'success')
          } else {
            this.notify('添加失败', 'error')
          }
        })
      console.log('ID======>', this.conditionId)
      console.log('condition=====>', this.condition)
      console.log('conditionValue===>', this.conditionValue)
    },
    // 保存编辑
    saveEdit () {
      console.log('picUrl===============>', this.form)
      let params = new URLSearchParams()
      params.append('id', this.form.id)
      params.append('name', this.form.name)
      params.append('price', this.form.price)
      params.append('introduction', this.form.introduction)
      params.append('picture', this.picUrl)
      params.append('mtype', this.form.mid)
      params.append('menuSize', this.form.menuSize)
      updateMenuMsg(params).then(res => {
        if (res.code === 1) {
          this.getData()
          this.notify('修改成功', 'success')
        } else {
          this.notify('修改失败', 'error')
        }
      }).catch(err => {
        console.log(err)
      })
      this.editVisible = false
    },
    // 确定删除
    deleteRow () {
      deleteMenu(this.idx)
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
    },

    handleCloseSize (tag) {
      let params = new URLSearchParams()
      params.append('id', tag.id)
      deleteConditionFunct(params)
        .then(res => {
          console.log(res)
          if (res.code === 1) {
            this.notify('删除成功', 'success')
            this.sizeList.splice(this.sizeList.indexOf(tag), 1)
          } else {
            this.notify('删除失败', 'error')
          }
        })
    },
    handleCloseTemp (tag) {
      let params = new URLSearchParams()
      params.append('id', tag.id)
      deleteConditionFunct(params)
        .then(res => {
          console.log(res)
          if (res.code === 1) {
            this.notify('删除成功', 'success')
            this.tempList.splice(this.tempList.indexOf(tag), 1)
          } else {
            this.notify('删除失败', 'error')
          }
        })
    },
    handleCloseSugar (tag) {
      let params = new URLSearchParams()
      params.append('id', tag.id)
      deleteConditionFunct(params)
        .then(res => {
          console.log(res)
          if (res.code === 1) {
            this.notify('删除成功', 'success')
            this.sugarList.splice(this.sugarList.indexOf(tag), 1)
          } else {
            this.notify('删除失败', 'error')
          }
        })
      this.deleteCondition(tag)
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
.el-tag + .el-tag {
    margin-left: 10px;
}
</style>
