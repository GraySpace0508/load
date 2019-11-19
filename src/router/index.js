import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/views/layout/index'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }, {
    path: '/',
    component: Layout,
    children: [{
      path: '/',
      component: () => import('@/views/car/monitor')
    }],
    hidden: true
  }, {
    path: '/car',
    component: Layout,
    hidden: true,
    children: [{
      path: '/car/violation_database',
      component: () => import('@/views/car/violation')
    }, {
      path: '/car/violation_detail',
      component: () => import('@/views/car/violation_detail')
    }, {
      path: '/car/list',
      component: () => import('@/views/car/list')
    }, {
      path: '/car/trace',
      component: () => import('@/views/car/trace')
    }, {
      path: '/car/flow',
      component: () => import('@/views/car/flow')
    }]
  }, {
    path: '/site',
    component: Layout,
    hidden: true,
    children: [{
      path: '/site/config',
      component: () => import('@/views/site/config')
    }, {
      path: '/site/cameras',
      component: () => import('@/views/site/cameras')
    }, {
      path: '/site/monitor',
      component: () => import('@/views/site/monitor')
    }, {
      path: '/site/monitor_detail',
      component: () => import('@/views/site/monitor_detail')
    }, {
      path: '/site/types',
      component: () => import('@/views/site/types')
    }]
  }, {
    path: '/user',
    component: Layout,
    children: [{
      path: '/user/mgt',
      component: () => import('@/views/user/mgt')
    }, {
      path: '/user/userplates',
      component: () => import('@/views/user/userplates')
    }, {
      path: '/user/pwd',
      component: () => import('@/views/user/pwd')
    }, {
      path: '/user/permission',
      component: () => import('@/views/user/permission')
    }, {
      path: '/user/loginpage_config',
      component: () => import('@/views/user/loginpage')
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
