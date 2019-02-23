
<style scoped>
.search_top {
  background: #f2f2f2;
  margin: 20px 0;
  padding: 20px 10px 0 10px;
}
.top_alert {
  margin-top: 20px;
}
</style>
<template>
  <section>
    <!--工具条-->
    <el-form :inline="true" :model="filters" label-position="left" label-width="100px">
      <div class="search_top">
        <el-row>
          <el-col :span="6">
            <el-form-item label="所属商户">
              <el-select
                v-model="filters.mid"
                class="fixed_search_input"
                placeholder="请输入商户关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteMer"
                :loading="merLoading"
                @change="changeMer"
                clearable
                @focus="clickMer"
              >
                <el-option
                  v-for="item in optionsMer"
                  :key="item.mid"
                  :value="item.mid"
                  :label="item.mname"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属门店">
              <el-select
                v-model="filters.sid"
                class="fixed_search_input"
                placeholder="请输入门店关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteStore"
                :loading="storeLoading"
                @change="changeStore"
                clearable
                @focus="clickStore"
              >
                <el-option
                  v-for="item in optionsStore"
                  :key="item.id"
                  :value="item.id"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属款台">
              <el-select
                v-model="filters.eid"
                class="fixed_search_input"
                placeholder="请输入款台关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteEmp"
                :loading="empLoading"
                clearable
                @focus="clickEmp"
              >
                <el-option
                  v-for="item in optionsEmp"
                  :key="item.eid"
                  :value="item.eid"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付方式">
              <el-select
                v-model="filters.payWay"
                class="fixed_search_input"
                placeholder="请选择支付方式"
                clearable
              >
                <el-option
                  v-for="item in optionsPayment"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="6">
            <el-form-item label="银行卡类型">
              <el-select
                v-model="filters.cardType"
                clearable
                class="fixed_search_input"
                placeholder="请选择银行卡类型"
                :disabled="filters.payWay!=='BANK'"
              >
                <el-option
                  v-for="item in optionsCardType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="支付状态">
              <el-select
                v-model="filters.status"
                clearable
                class="fixed_search_input"
                placeholder="请选择支付状态"
              >
                <el-option
                  v-for="item in optionsPayState"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交易金额">
              <el-input
                v-model="filters.goodsprice"
                class="fixed_search_input"
                placeholder="请输入交易金额"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input v-model="filters.orderId" class="fixed_search_input" placeholder="请输入订单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="第三方订单号">
              <el-input
                v-model="filters.transactionId"
                class="fixed_search_input"
                placeholder="请输入第三方订单号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item prop="startTime" label="交易时间">
              <el-date-picker v-model="filters.startTime" value-format="timestamp" class="fixed_search_input_datetime" type="datetime" @change="changTime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
              </el-date-picker>
            </el-form-item>
            <el-form-item>至</el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker v-model="filters.endTime" value-format="timestamp" class="fixed_search_input_datetime" type="datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round>查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border style="width: 100%;">
        <el-table-column prop="orderId" label="订单号" min-width="120"></el-table-column>
        <el-table-column
          label="交易时间"
          min-width="120"
          :formatter="formatterGmtCreate"
        ></el-table-column>
        <el-table-column prop="goodsPrice" label="交易金额" min-width="120"></el-table-column>
        <el-table-column prop="payWay" label="支付方式" min-width="120" :formatter="formatterPayWay"></el-table-column>
        <el-table-column prop="status" label="支付状态" min-width="120" :formatter="formatterStatus"></el-table-column>
        <el-table-column prop="username" label="商户名称" min-width="120"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleDetail(scope.$index, scope.row)">交易详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="page"
        background
        :page-size="20"
        :total="total"
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-row>
  </section>
</template>

<script>
import * as util from "@/util/util.js";
import * as async from "@/util/async-validator/addTerminalFormRules";
import {
  optionsPayment,
  terminalVersionOptions,
  optionsPayState
} from "@/util/mockData.js";
import getUsersList from "@/mixins/Users";
import {
  queryOrderList,
  updateTerminal,
  selectStoreList,
  selectEmpsBySid,
  queryMerMname
} from "@/api/api";
export default {
  mixins: [getUsersList],
  data() {
    var myDate = new Date();
    return {
      filters: {
        startTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()).getTime(),
        endTime: new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 23, 59, 59).getTime(),
        mid: "",
        sid: "",
        eid: "",
        payWay: "",
        cardType: "",
        status: "SUCCESS",
        goodsprice: "",
        orderId: "",
        transactionId: ""
      },
      optionsPayment: optionsPayment,
      optionsPayState: optionsPayState,
      empLoading: false,
      storeLoading: false,
      merLoading: false,
      optionsEmp: [],
      optionsStore: [],
      optionsMer: [],
        pickerOptions1: {
          disabledDate: (time) => {
            if (time.getTime() > Date.now()) {
              return true;
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let startTimeOne = this.filters.startTime
            if (time.getTime() > startTimeOne + 3600 * 1000 * 24 * 30 || time.getTime() < startTimeOne) {
              return true;
            }
          }
        }
    };
  },
  methods: {
    changTime(date) {
      let end_time = this.filters.endTime
      let date_time = date
      if (date_time < end_time - 3600 * 1000 * 24 * 30) {
        this.filters.endTime = date_time + 3600 * 1000 * 24 * 1 - 1000
      }
    },
    handleDetail(index, row) {
      this.$router.push({
        path: "/router03/shop/order5",
        query: { id: row.id }
      });
    },
    formatterGmtCreate(row, column) {
      return (row.payTime = util.formatDate.format(
        new Date(row.payTime),
        "yyyy/MM/dd hh:mm:ss"
      ));
    },
    formatterPayWay(row, column) {
      return util.formatPayment(row.payWay)
    },
    formatterStatus(row, column) {
      return util.formatPayStatus(row.status, row.orderType)
    },
    changeStore() {
      this.filters.eid = "";
    },
    changeMer() {
      this.filters.sid = "";
      this.filters.eid = "";
    },
    //款台远程搜索
    clickEmp: function() {
      this.empLoading = true;
      let para = {
        mid: this.$route.query.mid,
        storeId: this.filters.sid.toString() || "",
        ename: ""
      };
      selectEmpsBySid(para).then(res => {
        this.empLoading = false;
        let { status, data } = res;
        this.optionsEmp = data.emplyeeList;
      });
    },
    remoteEmp(query) {
      if (query !== "") {
        this.empLoading = true;
        setTimeout(() => {
          this.empLoading = false;
          let para = {
            storeId: this.filters.sid.toString() || "",
            ename: query
          };
          selectEmpsBySid(para).then(res => {
            this.optionsEmp = res.data.emplyeeList;
          });
        }, 200);
      } else {
        this.optionsEmp = [];
      }
    },
    clickStore() {
      this.storeLoading = true;
      selectStoreList({ mid: this.filters.mid }).then(res => {
        this.storeLoading = false;
        let { status, data } = res;
        this.optionsStore = data.storeList;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.storeLoading = true;
        setTimeout(() => {
          this.storeLoading = false;
          selectStoreList({
            sname: query,
            mid: this.filters.mid
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.storeList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
    },
    clickMer() {
      this.merLoading = true;
      queryMerMname({ mname: "" }).then(res => {
        this.merLoading = false;
        this.optionsMer = res.data;
      });
    },
    remoteMer(query) {
      if (query !== "") {
        this.merLoading = true;
        setTimeout(() => {
          this.merLoading = false;
          queryMerMname({
            mname: query
          }).then(res => {
            this.optionsMer = res.data;
          });
        }, 200);
      } else {
        this.optionsMer = [];
      }
    },
    //获取用户列表
    getList() {
      this.listLoading = true;
      let para = this.filters
      para.pageNum = this.page
      para.startTime = para.startTime.toString()
      para.endTime = para.endTime.toString()
      para.mid = para.mid.toString()
      para.sid = para.sid.toString()
      para.eid = para.eid.toString()
      queryOrderList(para).then(res => {
        this.listLoading = false;
        this.total = res.data.totalCount;
        this.users = res.data.orderList;
      });
    }
  }
};
</script>