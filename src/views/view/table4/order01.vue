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
                :picker-options="pickerOptions"
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
      <el-table :data="users" border="" stripe highlight-current-row>
        <el-table-column prop="order_id" label="订单号"/>
        <el-table-column prop="mname" label="商户名称"/>
        <el-table-column prop="store_name" label="门店名称"/>
        <el-table-column :formatter="formatCreate_time" label="支付时间"/>
        <el-table-column prop="goods_price" label="支付金额"/>
        <el-table-column :formatter="formatCreate_orderSource" label="原因"/>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="fillOrder(scope.$index, scope.row)">订单维护</el-button>
            <el-button type="warning" size="mini" @click="editOrder(scope.$index, scope.row)">修 改</el-button>
            <el-button type="info" size="mini" @click="detailsOrder(scope.$index, scope.row)">详 情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="修改待补订单" :visible.sync="orderDialogVisible" width="30%">
      <el-form :model="editOrderForm" ref="editOrderForm" label-width="100px">
        <el-form-item label="订单状态" prop="status">
          <el-radio v-model="editOrderForm.status" label="0">处理</el-radio>
          <el-radio v-model="editOrderForm.status" label="1">不处理</el-radio>
        </el-form-item>
        <!-- <el-form-item label="订单费率(‰)" prop="rate">
          <el-input-number v-model="editOrderForm.rate" :min="1" :max="1000" :precision="1"></el-input-number>
        </el-form-item>
        <el-form-item label="支付方式" prop="payWay">
          <el-select v-model="editOrderForm.payWay" placeholder="请选择">
            <el-option
              v-for="item in optionsPayment"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder">确 定</el-button>
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
          <span>{{detailsForm.channel === 'NEWLAND' ? '新大陆' : detailsForm.channel === 'FUIOU' ? '富有' : detailsForm.channel === 'NEWLAND_Bill' ? '新大陆对账单' : detailsForm.channel === 'BSB' ? '包商有氧金融' : '未知'}}</span>
        </el-form-item>
        <el-form-item label="订单类型：">
          <span>{{detailsForm.order_type === '0' ? '支付' : detailsForm.order_type === '1' ? '退款' : '未知'}}</span>
        </el-form-item>
        <el-form-item label="原因：">
          <span>{{formatCreate_orderSource(detailsForm)}}</span>
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
          <span>￥ {{detailsForm.reserve3}}</span>
        </el-form-item>
        <el-form-item label="费率(千分比)：">
          <span>{{detailsForm.rate}}</span>
        </el-form-item>
        <el-form-item label="补录类型：">
          <span>{{formatOderType(detailsForm.reserve2)}}</span>
        </el-form-item>
        <el-form-item label="补录状态：">
          <span>{{detailsForm.replacement_status === '0' ? '未处理' : detailsForm.replacement_status === '1' ? '已处理' : '未知'}}</span>
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
        background=""
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
  updateReplaceOrder
} from "@/api/api";
import { optionsPaymentAll } from "@/util/mockData.js";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        startTime: "",
        endTime: "",
        dateTime: [
          new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate()-1).getTime(),
          new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1,23,59,59).getTime()
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
        // rate: "",
        // payWay: "WX"
      },
      optionsPayment: optionsPaymentAll,
      detailsDialogVisible: false,
      detailsForm: {},
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
    formatCreate_orderSource(row, column) {
      return row.order_source === '10' ? '漏单数据' : row.order_source === '20' ? '订单状态异常' : row.order_source === '30' ? '手续费异常' : '其他'
    },
    formatCreate_time(row, column) {
      return util.formatDate.format(new Date(row.pay_time), "yyyy/MM/dd hh:mm:ss");
    },
    formatPay_way(row, column) {
      return util.formatPayment(row.pay_way);
    },
    formatPayment(data) {
      return util.formatPayment(data)
    },
    formatOderType(data) {
      return data === 'INSERT' ? '添加' : data === 'UPDATE' ? '更新' : '未知'
    },
    detailsOrder(index, row) {
      this.detailsDialogVisible = true
      this.$nextTick(() => {
        this.detailsForm = util.deepcopy(row)
      })
    },
    submitOrder() {
      let para = util.deepcopy(this.editOrderForm);
      para.id = para.id.toString();
      // para.rate = para.rate.toString();
      updateReplaceOrder(para).then(res => {
        this.getUsers();
        this.orderDialogVisible = false;
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    },
    editOrder(index, row) {
      this.orderDialogVisible = true;
      this.$nextTick(() => {
        this.editOrderForm.id = row.id;
        this.editOrderForm.status = row.replacement_status;
        // this.editOrderForm.payWay = row.pay_way;
      });
    },
    fillOrder(index, row) {
      this.$confirm("是否补录此订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          replaceOrderInsertOrder({ id: row.id.toString() }).then(res => {
            this.$message({
              type: "success",
              message: res.subMsg
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
      para.pageNum = this.page.toString();
      para.startTime = para.dateTime ? para.dateTime[0].toString() : "";
      para.endTime = para.dateTime ? para.dateTime[1].toString() : "";
      queryReplacementOrder(para).then(res => {
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
