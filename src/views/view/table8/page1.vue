<template>
  <section>
    <!--工具条-->
    <el-form :inline="true" :model="filters" ref="filters">
      <div class="search_top">
        <el-row>
          <el-form-item label="渠道商名称">
            <el-input v-model="filters.mname" placeholder="请输入渠道商名称关键字" style="width: 220px;"></el-input>
          </el-form-item>
          <!-- <el-form-item label="状态">
            <el-select v-model="filters.status" clearable placeholder="请选择状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item style="float: right;">
            <el-button type="primary" v-on:click="getUsers" round>查询</el-button>
            <el-button type="primary" @click="getShop" round>新增渠道商</el-button>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row style="width: 100%;">
        <el-table-column prop="merchant_name" label="渠道商名称" min-width="100"></el-table-column>
        <el-table-column prop="gmt_create" label="创建时间" min-width="100" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="business_name" label="行业类目" min-width="120"></el-table-column>
        <el-table-column prop="merchant_person" label="负责人"></el-table-column>
        <el-table-column prop="merchant_phone" label="负责人电话" min-width="120"></el-table-column>
        <el-table-column align="center" label="状态" min-width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.merchant_status === '0' ? 'info' : scope.row.merchant_status === '1' ? 'warning': scope.row.merchant_status === '2' ? 'danger' : 'success'"
              disable-transitions
            >{{formatMerchantStatus(scope.row, scope.$index)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              :disabled="scope.row.merchant_status === '1'"
              @click="handleModify(scope.$index, scope.row)"
            >修改</el-button>
            <!-- <el-button type="info" size="mini" v-show="scope.row.merchant_status === '2'" @click="showErrMessage(scope.$index, scope.row)">驳回原因</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  agentMerBsbEnter,
  updateAgentMer
} from "@/api/api";
export default {
  data() {
    return {
      whole: {
        sum: ""
      },
      //渠道商名
      filters: {
        mname: "",
        status: ""
      },
      total: 0,
      page: 1,
      users: [],
      listLoading: false,
      statusOptions: [
        {
          value: "0",
          label: "未提交"
        },
        {
          value: "3",
          label: "审核通过"
        }
      ]
    };
  },
  methods: {
    formatterDate(row, column) {
      return (row.gmt_create = util.formatDate.format(
        new Date(row.gmt_create),
        "yyyy/MM/dd hh:mm:ss"
      ));
    },
    // showErrMessage(index, row) {
    //   this.$alert(row.error_msg, "驳回原因", {
    //     type: 'warning'
    //   });
    // },
    //新增渠道商
    getShop: function() {
      this.$router.push("/router01/shop/page3");
    },
    handleModify(index, row) {
      this.$router.push({ path: "/router01/shop/page3", query: { id: row.id } });
    },
    //状态转换
    formatMerchantStatus: function(row, column) {
      return row.merchant_status === "0"
        ? "未提交"
        : row.merchant_status === "1"
        ? "审核中"
        : row.merchant_status === "2" && row.timely_sign === "0"
        ? "初次审核驳回"
        : row.merchant_status === "2" && row.timely_sign === "1"
        ? "审核驳回"
        : "审核通过";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    getUsers() {
      this.page = 1;
      this.getList();
    },
    //获取用户列表
    getList() {
      let para = {
        pageNum: this.page,
        merchant_name: this.filters.mname,
        merchant_status: this.filters.status
      };
      this.listLoading = true;
      agentMerBsbEnter(para).then(res => {
        this.total = res.data.totalCount;
        this.users = res.data.shopList;
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

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