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
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="100px">
      <div class="search_top">
        <el-form-item label="商户名称" prop="mname">
          <el-input v-model="filters.mname" class="fixed_search_input" placeholder="请输入关键字查询"/>
        </el-form-item>
        <el-form-item label="商户号" prop="maccount">
          <el-input v-model="filters.maccount" class="fixed_search_input" placeholder="请输入商户号"/>
        </el-form-item>
        <!-- <el-form-item label="联系人证件号">
          <el-input v-model="filters.person_id_no" class="fixed_search_input" placeholder="联系人证件号"></el-input>
        </el-form-item>
        <el-form-item label="法人证件号">
          <el-input v-model="filters.merchant_id_no" class="fixed_search_input" placeholder="法人证件号"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
          <el-button @click="resetForm('filters')" round>重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border="" stripe highlight-current-row>
        <el-table-column prop="agentName" label="所属渠道商"/>
        <el-table-column prop="mname" label="商户名称"/>
        <el-table-column prop="maccount" label="商户号"/>
        <el-table-column label="支付权限">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="editStatus(scope.$index, scope.row)"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          :formatter="formatCreate_time"
          label="准入日期"
        />
        <el-table-column prop="saleName" label="业务员"/>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="clickLook(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="total, prev, pager, next"
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
import { queryMerchant, updateMerStatus } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        mname: "",
        maccount: "",
        person_id_no: '',
        merchant_id_no: ''
      }
    };
  },
  methods: {
    formatCreate_time(row, column) {
      return (row.create_time = util.formatDate.format(
        new Date(row.create_time),
        "yyyy/MM/dd"
      ));
    },
    clickLook (index, row) {
      this.$router.push({ path: '/router02/shop/table5', query: { mid: row.mid.toString(), maccount: row.maccount } })
    },
    editStatus(index, row) {
      this.$confirm("此操作将修改支付权限, 确定修改?", "提示", {
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
                message: message,
                showClose: true
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
      queryMerchant(para).then(res => {
        this.users = res.data.merchantsList;
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
