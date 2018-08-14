const viewCollapse = {
  state: {
    isCollapse: false
  },
  mutations: {
    UPLOAD_COLLAPSE: (state, view) => {
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {
    upload_collapse ({ commit }, view) {
      commit('UPLOAD_COLLAPSE', view)
    }
  }
}
export default viewCollapse
