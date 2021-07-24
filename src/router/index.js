const router = {
  routes: [
    {
      path: '/Home',
      component: resolve => require(['../components/Home.vue'], resolve),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/Info',
          component: resolve => require(['../pages/InfoPage.vue'], resolve),
          meta: { title: 'Info' }
        },
        {
          path: '/Order',
          component: resolve => require(['../pages/OrderPage.vue'], resolve),
          meta: { title: 'Order' }
        },
        {
          path: '/Comment',
          component: resolve => require(['../pages/CommentPage.vue'], resolve),
          meta: { title: 'Comment' }
        },
        {
          path: '/Consumer',
          component: resolve => require(['../pages/ConsumerPage.vue'], resolve),
          meta: { title: 'Consumer' }
        },
        {
          path: '/Collect',
          component: resolve => require(['../pages/CollectPage.vue'], resolve),
          meta: { title: 'Collect' }
        },
        {
          path: '/Menu',
          component: resolve => require(['../pages/MenuPage.vue'], resolve),
          meta: { title: 'Menu' }
        },
        {
          path: '/Menutype',
          component: resolve => require(['../pages/MenuTypePage.vue'], resolve),
          meta: {title: 'Menutype'}
        },
        {
          path: '/Shop',
          component: resolve => require(['../pages/ShopPage.vue'], resolve),
          meta: {title: 'ShopPage'}
        },
        {
          path: '/Coupon',
          component: resolve => require(['../pages/CouponPage.vue'], resolve),
          meta: {title: 'Coupon'}
        }
      ]
    },
    {
      path: '/',
      component: resolve => require(['../pages/Login.vue'], resolve)
    }
  ]
}

export default router
