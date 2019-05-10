import Vue from 'vue'
import Vuex from 'vuex'
import viewCollapse from './modules/viewCollapse'
import reBate from './modules/reBate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    viewCollapse,
    reBate
  }
})

export default store
