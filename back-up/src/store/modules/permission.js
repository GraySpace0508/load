import { getMenus } from '@/api/api'

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        getMenus().then(response => {
          const data = response.data
          commit('SET_ROUTERS', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
