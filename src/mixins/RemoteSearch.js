export default {
  data () {
    return {
      storeSearchLoading: false,
      empSearchLoading: false,
      shopSearchLoading: false,
      optionsEmp: [],
      optionsStore: [],
      optionsShop: []
    }
  },
  methods: {
    // 商户远程搜索
    selectShopChange () {

    },
    clickShop () {

    },
    remoteShop () {

    },
    // 门店远程搜索
    selectStoreChange () {
      this.filters.empName = ''
    },
    clickStore: function () {
      this.storeSearchLoading = true
      // selectStoreList ().then((res) => {
      //   this.searchLoading = false
      //   let { status, data } = res
      //   this.optionsStore = data.storeList
      // })
    },
    remoteStore (query) {
      if (query !== '') {
        this.storeSearchLoading = true
        setTimeout(() => {
          this.storeSearchLoading = false
          // selectStoreList({
          //   sname: query
          // }).then((res) => {
          //   let {
          //     status,
          //     data
          //   } = res
          //   this.optionsStore = data.storeList
          // })
        }, 200)
      } else {
        this.optionsStore = []
      }
    },
    // 款台远程搜索
    clickEmp: function () {
      this.empSearchLoading = true
      // let para = {
      //   mid: sessionStorage.getItem('mid'),
      //   storeId: String(this.filters.storeName),
      //   ename: ''
      // }
      // selectEmpsBySid(para).then((res) => {
      //   this.empSearchLoading = false;
      //   let {
      //     status,
      //     data
      //   } = res
      //   this.optionsEmp = data.emplyeeList
      // })
    },
    remoteEmp (query) {
      if (query !== '') {
        this.empSearchLoading = true
        setTimeout(() => {
          this.empSearchLoading = false
          // let para = {
          //   mid: sessionStorage.getItem('mid'),
          //   storeId: String(this.filters.storeName),
          //   ename: query
          // }
          // selectEmpsBySid(para).then((res) => {
          //   let {
          //     status,
          //     data
          //   } = res
          //   this.optionsEmp = data.emplyeeList
          // })
        }, 200)
      } else {
        this.optionsEmp = []
      }
    }
  }
}
