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
            <el-form-item label="交易状态" prop="status">
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
            <el-form-item label="交易金额" prop="goodsPrice">
              <el-input v-model="filters.goodsPrice" placeholder="请输入交易金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="orderId" label="订单号"/>
        <el-table-column prop="mname" label="商户名称"/>
        <el-table-column prop="goodsPrice" label="交易金额"/>
        <el-table-column :formatter="formatCreate_time" label="付款时间"/>
        <el-table-column :formatter="formatCreate_statue" label="交易状态"/>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <el-button type="success" size="mini" :disabled="listDisabled[scope.$index]" @click="fillOrder(scope.$index, scope.row)">异常订单同步</el-button>
            <el-button type="warning" size="mini" @click="editOrder(scope.$index, scope.row)">更新订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="更新订单" :visible.sync="orderDialogVisible" width="30%">
      <el-form :model="editOrderForm" ref="editOrderForm" label-width="100px" label-position="left">
        <el-form-item label="订单号：">
          {{editOrderForm.orderId}}
        </el-form-item>
        <el-form-item label="支付金额：">
          {{editOrderForm.goodsPrice}}
        </el-form-item>
        <el-form-item label="支付时间">
          {{formatCreate_time(editOrderForm)}}
        </el-form-item>
        <el-form-item label="支付状态" prop="status">
          <el-select v-model="editOrderForm.status" placeholder="请选择">
            <el-option
              v-for="item in optionsPayment"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder">确 定</el-button>
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
  queryExceptionOrderList,
  replaceOrderInsertOrder,
  updateReplaceOrder,
  synExceptionOrderStatus,
  updateExceptionOrder,
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
          new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate()).getTime(),
          new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),23,59,59).getTime()
        ],
        status: "2",
        goodsPrice: ""
      },
      statusOptions: [
        {
          value: "2",
          label: "支付失败"
        },
        {
          value: "0",
          label: "待支付"
        },
        {
          value: "5",
          label: "未知"
        }
      ],
      orderDialogVisible: false,
      editOrderForm: {
        orderId: '',
        goodsPrice: '',
        createTime: '',
        status: ''
      },
      listDisabled: [],
      optionsPayment:  [
        {
          value: "2",
          label: "支付失败"
        },
        {
          value: "0",
          label: "待支付"
        },
        {
          value: "1",
          label: "支付成功"
        }
      ],
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
    formatCreate_time(row, column) {
      return util.formatDate.format(
        new Date(row.createTime),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    formatCreate_statue(row, column) {
      return row.status === '0' ? '待支付' : row.status === '2' ? '支付失败' : '未知'
    },
    submitOrder() {
      let para = util.deepcopy(this.editOrderForm);
      updateExceptionOrder(para).then(res => {
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
        let form = util.deepcopy(row)
        this.editOrderForm.orderId = form.orderId
        this.editOrderForm.goodsPrice = form.goodsPrice
        this.editOrderForm.createTime = form.createTime
        this.editOrderForm.status = '1'
      });
    },
    fillOrder(index, row, name) {
      this.$confirm("是否同步此订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$set(this.listDisabled, index, true)
          synExceptionOrderStatus({ orderId: row.orderId.toString() }).then(res => {
            this.$message({
              type: "success",
              message: res.message,
              showClose: true
            });
            this.$set(this.listDisabled,index,false)
            this.getUsers();
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消同步此订单"
          });
        });
    },
    getList() {
      this.listLoading = true
      let para = this.filters;
      para.pageNum = this.page.toString();
      para.startTime = para.dateTime ? para.dateTime[0].toString() : "";
      para.endTime = para.dateTime ? para.dateTime[1].toString() : "";
      queryExceptionOrderList(para).then(res => {
        this.listLoading = false
        this.users = res.data.orderList;
        this.total = res.data.total;
      });
    }
  }
};
</script>
