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
.fixed_search_input{
    max-width: 125px;
}
.fixed_search_input_datetime{
    max-width: 195px;
}
.fixed_search_seach{
  max-width: 125px;
}
.fixed_search_input_date{
    max-width: 145px;
}
</style>

<template>
  <section>
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="80px">
      <div class="search_top">
        <el-row>
          <el-col :span="13">
            <el-form-item prop="startTime" label="交易时间">
              <el-date-picker v-model="filters.startTime" value-format="timestamp" class="fixed_search_input_datetime" type="datetime" placeholder="选择开始日期" :picker-options="pickerOptions1" :clearable="false" :editable='false'>
              </el-date-picker>
            </el-form-item>
            <el-form-item>至</el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker v-model="filters.endTime" value-format="timestamp" class="fixed_search_input_datetime" type="datetime" placeholder="选择结束日期" :picker-options="pickerOptions2" :clearable="false" :editable='false'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
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
        <el-table-column prop="transaction_id" label="订单号"/>
        <el-table-column prop="mname" label="商户名称"/>
        <el-table-column prop="store_name" label="门店名称"/>
        <el-table-column :formatter="formatCreate_time" label="支付时间"/>
        <el-table-column prop="goods_price" label="支付金额(元)"/>
        <el-table-column :formatter="formatCreate_orderSource" label="原因"/>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="detailsOrder(scope.$index, scope.row)">详 情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="订单详情" :visible.sync="detailsDialogVisible" width="35%">
      <el-form :model="detailsForm" label-width="120px" label-position="left">
        <el-form-item label="订单号：">
          <span>{{detailsForm.transaction_id}}</span>
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
        <el-form-item label="支付时间：">
          <span>{{formatCreate_time(detailsForm)}}</span>
        </el-form-item>
        <el-form-item label="支付金额(元)：">
          <span>￥ {{detailsForm.goods_price}}</span>
        </el-form-item>
        <el-form-item label="手续费(元)：">
          <span>￥ {{detailsForm.reserve3}}</span>
        </el-form-item>
        <el-form-item label="费率(‰)：">
          <span>{{detailsForm.rate * 1000}}</span>
        </el-form-item>
        <el-form-item label="订单来源：">
          <span>{{detailsForm.channel === 'NEWLAND' ? '新大陆' : detailsForm.channel === 'FUIOU' ? '富有' : detailsForm.channel === 'NEWLAND_Bill' ? '新大陆对账单' : detailsForm.channel === 'BSB' ? '包商有氧金融' : '未知'}}</span>
        </el-form-item>
        <el-form-item label="订单类型：">
          <span>{{detailsForm.order_type === '0' ? '支付订单' : detailsForm.order_type === '1' ? '退款订单' : '未知'}}</span>
        </el-form-item>
        <el-form-item label="原因：">
          <span>{{formatCreate_orderSource(detailsForm)}}</span>
        </el-form-item>
        <el-form-item label="补录类型：">
          <span>{{formatOderType(detailsForm.reserve2)}}</span>
        </el-form-item>
        <el-form-item label="补录状态：">
          <span>{{detailsForm.replacement_status === '0' ? '未处理' : detailsForm.replacement_status === '1' ? '已处理' : '未知'}}</span>
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
        startTime: new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate()-1).getTime(),
        endTime: new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1,23,59,59).getTime(),
        status: '1'
      },
      detailsDialogVisible: false,
      detailsForm: {},
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
            if (time.getTime() < startTimeOne) {
              return true;
            }
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
    getList() {
      let para = this.filters;
      para.pageNum = this.page.toString();
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
