const reBate = {
  state: {
    agentId: '',
    date: '',
    status: ''
  },
  mutations: {
    UPLOAD_REBATE: (state, view) => {
      state.agentId = view.agentId
      state.date = view.date
      state.status = view.status
    }
  },
  actions: {
    upload_rebate({
      commit
    }, view) {
      commit('UPLOAD_REBATE', view)
    }
  }
}
export default reBate
