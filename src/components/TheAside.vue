<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#242526"
      text-color="#B0B3B2"
      active-text-color="#ffffff"
      unique-opened
      router
    >
    <!-- router是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
      <template v-for="item in items">
          <template>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import _ctrEvent from '../assets/js/ctr-event'

export default {
  data () {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-s-shop',
          index: 'shop',
          title: '商家管理'
        },
        {
          icon: 'el-icon-user-solid',
          index: 'consumer',
          title: '用户管理'
        },
        {
          icon: 'el-icon-menu',
          index: 'menutype',
          title: '菜单类型管理'
        },
        {
          icon: 'el-icon-dish-1',
          index: 'menu',
          title: '菜品管理'
        },
        {
          icon: 'el-icon-service',
          index: 'order',
          title: '订单管理'
        },
        {
          icon: 'el-icon-document',
          index: 'comment',
          title: '评论管理'
        },
        {
          icon: 'el-icon-document',
          index: 'coupon',
          title: '优惠券管理'
        }
      ]
    }
  },
  computed: {
    onRoutes () {
      let routeIndex = this.$route.path.replace('/', '')
      console.log('切换路由已执行================》', routeIndex)
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    _ctrEvent.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  background-color: #334256;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 150px;
}
.sidebar > ul {
  height: 100%;
}
</style>
