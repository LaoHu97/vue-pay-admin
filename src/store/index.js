import Vue from 'vue'
import Vuex from 'vuex'
import viewCollapse from './modules/viewCollapse'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    viewCollapse
  }
})

export default store
