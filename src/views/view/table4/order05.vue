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
<style>
.fixed_search_input {
  max-width: 160px;
}
.fixed_search_date {
  max-width: 220px;
}
</style>

<template>
  <section>
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="80px">
      <div class="search_top">
        <el-row>
          <el-col :span="10">
            <el-form-item label="查询日期" prop="dateTime">
              <el-date-picker
                v-model="filters.dateTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                :default-time="['00:00:00', '23:59:59']"
                :clearable="false"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态" prop="status">
              <el-select v-model="filters.status" placeholder="请选择">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
              <el-button @click="resetForm('filters')" round>重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="order_id" label="订单号" />
        <el-table-column prop="order_type" label="订单类型" :formatter="formatorder_type" />
        <el-table-column prop="pay_way" label="支付方式" :formatter="formatPay_way" />
        <el-table-column prop="mname" label="商户名称" />
        <el-table-column prop="store_name" label="门店名称" />
        <el-table-column :formatter="formatCreate_time" label="支付时间" />
        <el-table-column prop="goods_price" label="支付金额" />
        <el-table-column prop="factorage" label="手续费" />
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <!-- <el-button type="success" size="mini" :disabled="scope.row.replacement_status === '1'" @click="fillOrder(scope.$index, scope.row)">补录订单</el-button> -->
            <el-button type="warning" size="mini" v-if="scope.row.is_accounts_balance === '0'" @click="removeOrder(scope.$index, scope.row)">丢 弃</el-button>
            <el-button
              type="warning"
              size="mini"
              v-if="scope.row.is_repair === '0' && scope.row.is_accounts_balance === '0'"
              @click="editOrder(scope.$index, scope.row)"
            >补 单</el-button>
            <el-button
              type="warning"
              size="mini"
              v-if="scope.row.is_accounts_balance === '1'"
              @click="rollbackOrder(scope.$index, scope.row)"
            >回 滚</el-button>
            <el-button type="info" size="mini" @click="detailsOrder(scope.$index, scope.row)">详 情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="补单" :visible.sync="orderDialogVisible" width="30%">
      <el-form
        :model="editOrderForm"
        :rules="editOrderFormRules"
        ref="editOrderForm"
        label-position="left"
        label-width="120px"
      >
        <!-- <el-form-item label="订单状态" prop="status">
          <el-radio v-model="editOrderForm.status" label="0" @change="orderStatusChange">处理</el-radio>
          <el-radio v-model="editOrderForm.status" label="1" @change="orderStatusChange">不处理</el-radio>
        </el-form-item>-->
        <el-form-item label="支付方式" prop="payWay">
          <el-select v-model="editOrderForm.payWay" placeholder="请选择">
            <el-option
              v-for="item in optionsPayment"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户名称" prop="mName">
          <el-select
            v-model="editOrderForm.mName"
            placeholder="请输入商户名称关键字查询"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteMerchants"
            :loading="merchantsLoading"
            clearable
            @focus="clickMerchants"
          >
            <el-option
              v-for="item in optionsMerchants"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称" prop="sName">
          <el-select
            v-model="editOrderForm.sName"
            placeholder="请输入门店名称关键字查询"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteStore"
            :loading="storeLoading"
            clearable
            @focus="clickStore"
          >
            <el-option
              v-for="item in optionsStore"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型" prop="orderType">
          <el-select v-model="editOrderForm.orderType" placeholder="请选择">
            <el-option label="支付" value="0"></el-option>
            <el-option label="退款" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单费率(‰)" prop="rate">
          <el-input-number v-model="editOrderForm.rate" :min="0" :max="1000" :precision="1"></el-input-number>
        </el-form-item>
        <el-form-item label="手续费" prop="factorage">
          <el-input-number v-model="editOrderForm.factorage" :min="0" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="特殊费率名称" prop="srName">
          <!-- <el-input v-model="editOrderForm.srName"></el-input> -->
          <el-select
            v-model="editOrderForm.srName"
            placeholder="请输入特殊费率名称"
            :multiple="false"
            filterable
            remote
            :remote-method="remotespeName"
            :loading="speNameLoading"
            clearable
            @focus="clickspeName"
          >
            <el-option
              v-for="item in optionsspeName"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理名称" prop="aName">
          <!-- <el-input v-model="editOrderForm.aName"></el-input> -->
          <el-select
            v-model="editOrderForm.aName"
            placeholder="请输入代理名称"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteagentName"
            :loading="agentNameLoading"
            clearable
            @focus="clickagentName"
          >
            <el-option
              v-for="item in optionsagentName"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠金额" prop="discount">
          <el-input-number v-model="editOrderForm.discount" :min="0" :precision="2"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder('editOrderForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单详情" :visible.sync="detailsDialogVisible" width="35%">
      <el-form :model="detailsForm" label-width="120px" label-position="left">
        <el-form-item label="订单号：">
          <span>{{detailsForm.order_id}}</span>
        </el-form-item>
        <el-form-item label="通道订单号：">
          <span>{{detailsForm.transaction_id}}</span>
        </el-form-item>
        <el-form-item label="订单来源：">
          <span>{{detailsForm.source === 1 ? '易融码' : detailsForm.source === 2 ? '富友' : detailsForm.source === 3 ? '新大陆' : detailsForm.source === 4 ? '扫呗' : detailsForm.source === 5 ? '微信' : detailsForm.source === 6 ? '支付宝' : '未知'}}</span>
        </el-form-item>
        <el-form-item label="订单类型：">
          <span>{{detailsForm.order_type === '0' ? '支付' : detailsForm.order_type === '1' ? '退款' : '未知'}}</span>
        </el-form-item>
        <el-form-item label="第三方商户号：">
          <span>{{detailsForm.third_mid}}</span>
        </el-form-item>
        <el-form-item label="商户名称：">
          <span>{{detailsForm.mname}}</span>
        </el-form-item>
        <el-form-item label="门店名称：">
          <span>{{detailsForm.store_name}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>{{formatPayment(detailsForm.pay_way)}}</span>
        </el-form-item>
        <el-form-item label="支付金额：">
          <span>￥ {{detailsForm.goods_price}}</span>
        </el-form-item>
        <el-form-item label="手续费：">
          <span>￥ {{detailsForm.factorage}}</span>
        </el-form-item>
        <el-form-item label="费率(千分比)：">
          <span>{{detailsForm.rate}}</span>
        </el-form-item>
        <el-form-item label="异常类型：">
          <span>{{formatOderType(detailsForm.ex_type)}}</span>
        </el-form-item>
        <el-form-item label="补单状态：">
          <span>{{detailsForm.is_repair === '0' ? '未补单' : detailsForm.is_repair === '1' ? '已补单' : '未知'}}</span>
        </el-form-item>
        <el-form-item label="支付时间：">
          <span>{{formatCreate_time(detailsForm)}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  queryReplacementOrder,
  replaceOrderInsertOrder,
  updateReplaceOrder,
  queryPendingOrder,
  pendingOrderPutOrder,
  updatePendingOrder,
  discardPendingOrder,
  rollBackPendingOrder,
  queryMerchantsInfo,
  queryStoreInfo,
  querySpeRateInfo,
  queryAgentInfo
} from "@/api/api";
import { optionsPaymentAll } from "@/util/mockData.js";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

const rules = {
  status: [{ required: true, message: "请选择订单状态", trigger: "change" }],
  payWay: [{ required: true, message: "请选择支付方式", trigger: "change" }],
  mName: [{ required: true, message: "请输入商户名称", trigger: "change" }],
  sName: [{ required: true, message: "请输入门店名称", trigger: "change" }],
  orderType: [{ required: true, message: "请输入订单类型", trigger: "change" }]
};

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        startTime: "",
        endTime: "",
        dateTime: [
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - 1
          ).getTime(),
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - 1,
            23,
            59,
            59
          ).getTime()
        ],
        status: "0"
      },
      statusOptions: [
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "已处理"
        }
      ],
      orderDialogVisible: false,
      editOrderForm: {
        id: "",
        status: "0",
        rate: "",
        payWay: "WX",
        mName: "",
        sName: "",
        orderType: "",
        factorage: "",
        srName: "",
        aName: "",
        discount: ""
      },
      optionsPayment: optionsPaymentAll,
      detailsDialogVisible: false,
      detailsForm: {},
      editOrderFormRules: rules,

      optionsMerchants: [],
      merchantsLoading: false,

      optionsStore: [],
      storeLoading: false,

      optionsspeName: [],
      speNameLoading: false,

      optionsagentName: [],
      agentNameLoading: false
    };
  },
  methods: {
    formatCreate_time(row, column) {
      return util.formatDate.format(
        new Date(row.pay_time),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    formatPay_way(row, column) {
      return util.formatPayment(row.pay_way);
    },
    formatPayment(data) {
      return util.formatPayment(data);
    },
    formatOderType(data) {
      return data === 1 ? "数据不一致" : data === 2 ? "漏单" : "未知";
    },
    formatorder_type(row){
      return row.order_type === '0' ? '支付' : row.order_type === '1' ? '退款' : '未知'
    },
    clickagentName() {
      this.agentNameLoading = true;
      queryAgentInfo({ aName: '' }).then(res => {
        this.agentNameLoading = false;
        this.optionsagentName = res.data;
      });
    },
    remoteagentName(query) {
      if (query !== "") {
        this.agentNameLoading = true;
        setTimeout(() => {
          this.agentNameLoading = false;
          queryAgentInfo({
            aName: query
          }).then(res => {
            this.optionsagentName = res.data;
          });
        }, 200);
      } else {
        this.optionsagentName = [];
      }
    },
    clickspeName() {
      this.speNameLoading = true;
      querySpeRateInfo({ srName: '' }).then(res => {
        this.speNameLoading = false;
        this.optionsspeName = res.data;
      });
    },
    remotespeName(query) {
      if (query !== "") {
        this.speNameLoading = true;
        setTimeout(() => {
          this.speNameLoading = false;
          querySpeRateInfo({
            srName: query
          }).then(res => {
            this.optionsspeName = res.data;
          });
        }, 200);
      } else {
        this.optionsspeName = [];
      }
    },
    clickStore() {
      this.storeLoading = true;
      queryStoreInfo({ sName: this.editOrderForm.sName, mName: this.editOrderForm.mName }).then(res => {
        this.storeLoading = false;
        this.optionsStore = res.data;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.storeLoading = true;
        setTimeout(() => {
          this.storeLoading = false;
          queryStoreInfo({
            sName: query,
            mName: this.editOrderForm.mName
          }).then(res => {
            this.optionsStore = res.data;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
    },
    clickMerchants() {
      this.merchantsLoading = true;
      queryMerchantsInfo({ mName: this.editOrderForm.mName }).then(res => {
        this.merchantsLoading = false;
        this.optionsMerchants = res.data;
      });
    },
    remoteMerchants(query) {
      if (query !== "") {
        this.merchantsLoading = true;
        setTimeout(() => {
          this.merchantsLoading = false;
          queryMerchantsInfo({
            mName: query
          }).then(res => {
            this.optionsMerchants = res.data;
          });
        }, 200);
      } else {
        this.optionsMerchants = [];
      }
    },
    rollbackOrder(index, row) {
      this.$confirm("是否回滚此订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          rollBackPendingOrder({ id: row.id.toString() }).then(res => {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.getUsers();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    removeOrder(index, row) {
      this.$confirm("是否丢弃此订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          discardPendingOrder({ id: row.id.toString() }).then(res => {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.getUsers();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    orderStatusChange(e) {
      console.log(e);
      if (e === "1") {
        this.editOrderFormRules = {};
        this.$refs.editOrderForm.clearValidate();
      } else {
        this.editOrderFormRules = rules;
      }
    },
    detailsOrder(index, row) {
      this.detailsDialogVisible = true;
      this.$nextTick(() => {
        this.detailsForm = util.deepcopy(row);
      });
    },
    submitOrder(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.editOrderForm);
          para.id = para.id.toString();
          para.rate = para.rate.toString();
          para.factorage = para.factorage.toString();
          para.discount = para.discount.toString()
          updatePendingOrder(para).then(res => {
            this.getUsers();
            this.orderDialogVisible = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
          });
        }
      });
    },
    editOrder(index, row) {
      this.orderDialogVisible = true;
      this.$nextTick(() => {
        this.editOrderForm.id = row.id;
        this.editOrderForm.status = row.status
        this.editOrderForm.rate = row.rate
        this.editOrderForm.payWay = row.pay_way
        this.editOrderForm.mName = row.mname
        this.editOrderForm.sName = row.store_name
        this.editOrderForm.orderType = row.order_type
        this.editOrderForm.factorage = row.factorage
        this.editOrderForm.srName = row.spe_name
        this.editOrderForm.aName = row.user_name
        this.editOrderForm.discount = row.discount
        this.clickagentName()
        this.clickspeName()
        this.clickStore()
        this.clickMerchants()
      });
    },
    fillOrder(index, row) {
      this.$confirm("是否补录此订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          pendingOrderPutOrder({ id: row.id.toString() }).then(res => {
            this.$message({
              type: "success",
              message: "补录成功"
            });
            this.getUsers();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editStatus(index, row) {
      this.$confirm("此操作将修改商户状态, 确定修改?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          let para = {
            mid: row.mid.toString(),
            status: row.status.toString()
          };
          updateMerStatus(para).then(res => {
            let { status, message } = res;
            if (status == 200) {
              this.$message({
                type: "success",
                message: message
              });
            } else {
              this.getUsers();
              this.$message.error(message);
            }
          });
        })
        .catch(() => {
          this.getUsers();
          this.$message({
            type: "info",
            message: "取消修改"
          });
        });
    },
    getList() {
      let para = this.filters;
      para.pageNum = this.page;
      para.rowNum = 20;
      para.startTime = para.dateTime ? para.dateTime[0].toString() : "";
      para.endTime = para.dateTime ? para.dateTime[1].toString() : "";
      this.listLoading = true
      queryPendingOrder(para).then(res => {
        this.listLoading = false
        this.users = res.data.orderList;
        this.total = res.data.totalCount;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {}
};
</script>
