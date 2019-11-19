<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.menuId" :item="route" :base-path="route.menuUrl" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { getMenus } from '@/api/user'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  data () {
    return {
      permission_routers: []
    }
  },
  computed: {
    ...mapGetters([
      // 'permission_routers',
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    getMenus () {
      getMenus().then(res => {
        if (res.status === 200)
          this.permission_routers = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
}
</script>
