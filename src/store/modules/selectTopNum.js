const selectTopNum = {
  state: {
    num: '1'
  },
  mutations: {
    UPLOAD_TOPNUM: (state, view) => {
      state.num = view
    }
  },
  actions: {
    upload_topNum({
      commit
    }, view) {
      commit('UPLOAD_TOPNUM', view)
    }
  }
}
export default selectTopNum
