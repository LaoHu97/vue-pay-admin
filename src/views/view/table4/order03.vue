
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
          <el-col :span="6">
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
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态">
              <el-select
                v-model="filters.status"
                clearable
                class="fixed_search_input"
                placeholder="请选择订单状态"
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
            <el-form-item label="消费金额">
              <el-input
                v-model="filters.goodsprice"
                class="fixed_search_input"
                placeholder="请输入消费金额"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input v-model="filters.orderId" class="fixed_search_input" placeholder="请输入订单号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="渠道号">
              <el-input
                v-model="filters.transactionId"
                class="fixed_search_input"
                placeholder="请输入渠道号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期时间">
              <el-date-picker
                v-model="filters.queryDateTime"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                :picker-options="pickerOptions"
                :clearable="false"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
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
        <el-table-column prop="transactionId" label="渠道号" min-width="120"></el-table-column>
        <el-table-column prop="username" label="商户名称" min-width="120"></el-table-column>
        <el-table-column
          label="付款时间"
          min-width="120"
          :formatter="formatterGmtCreate"
        ></el-table-column>
        <el-table-column prop="goodsPrice" label="付款金额" min-width="120"></el-table-column>
        <el-table-column prop="status" label="支付状态" min-width="120" :formatter="formatterStatus"></el-table-column>
        <el-table-column prop="payWay" label="支付方式" min-width="120" :formatter="formatterPayWay"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleDet(scope.$index, scope.row)">详 情</el-button>
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
    <!--详情界面-->
    <el-dialog title="订单详情" :visible.sync="detFormVisible" width="30%">
      <el-form :model="detForm" label-width="120px" label-position="left">
        <el-form-item label="订单号">
          <span>{{detForm.orderId}}</span>
        </el-form-item>
        <el-form-item label="渠道号：">
          <span>{{detForm.transactionId}}</span>
        </el-form-item>
        <el-form-item label="付款金额：">
          <span>{{detForm.goodsPrice}}</span>
        </el-form-item>
        <el-form-item label="付款时间：">
          <span>{{formatterGmtCreate(detForm)}}</span>
        </el-form-item>
        <el-form-item label="支付状态：">
          <span>{{formatterStatus(detForm)}}</span>
        </el-form-item>
        <el-form-item label="所属门店：">
          <span>{{detForm.storeName}}</span>
        </el-form-item>
        <el-form-item label="所属款台：">
          <span>{{detForm.username}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>{{formatterPayWay(detForm)}}</span>
        </el-form-item>
        <el-form-item label="备注：">
          <span>{{detForm.goodsDesc}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click.native="detFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
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
  queryOrderDetail,
  updateTerminal,
  selectStoreList,
  selectEmpsBySid,
  queryMerMname
} from "@/api/api";
export default {
  mixins: [getUsersList],
  data() {
    return {
      filters: {
        queryDateTime: [          
          new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate()).getTime(),
          new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),23,59,59).getTime()
        ],
        mid: "",
        sid: "",
        eid: "",
        payWay: "",
        cardType: "",
        status: "",
        goodsprice: "",
        orderId: "",
        transactionId: ""
      },
      optionsCardType: [
        {
          value: "CREDIT",
          label: "贷记卡"
        },
        {
          value: "DEBIT",
          label: "借记卡"
        }
      ],
      detFormVisible: false,
      optionsPayment: optionsPayment,
      optionsPayState: optionsPayState,
      detForm: {},
      empLoading: false,
      storeLoading: false,
      merLoading: false,
      optionsEmp: [],
      optionsStore: [],
      optionsMer: [],
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() >
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            )
          );
        }
      }
    };
  },
  methods: {
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
      let para = util.deepcopy(this.filters)
      para.pageNum = this.page
      para.startTime = para.queryDateTime ? para.queryDateTime[0].toString() : "";
      para.endTime = para.queryDateTime ? para.queryDateTime[1].toString() : ""
      para.mid = para.mid.toString()
      para.sid = para.sid.toString()
      para.eid = para.eid.toString()
      queryOrderList(para).then(res => {
        this.listLoading = false;
        this.total = res.data.totalCount;
        this.users = res.data.orderList;
      });
    },
    //显示详情界面
    handleDet: function(index, row) {
      this.detFormVisible = true;
      queryOrderDetail({ orderId: row.orderId }).then(res => {
        this.detForm = res.data.order;
      });
    }
  }
};
</script>