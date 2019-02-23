import Vue from 'vue'
import Vuex from 'vuex'
import viewCollapse from './modules/viewCollapse'
import selectTopNum from './modules/selectTopNum'
import tagsView from './modules/tagsView.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    viewCollapse,
    selectTopNum,
    tagsView
  }
})

export default store
