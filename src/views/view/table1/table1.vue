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
          <el-col :span="6">
            <el-form-item label="商户名称" prop="mname">
              <el-input v-model="filters.mname" placeholder="请输入关键字查询"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户账号" prop="maccount">
              <el-input v-model="filters.maccount" placeholder="请输入商户账号"/>
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
        <el-table-column prop="agentName" align="center" label="所属代理"/>
        <el-table-column prop="mname" align="center" label="商户名称"/>
        <el-table-column prop="maccount" align="center" label="商户账号"/>
        <el-table-column align="center" label="登陆状态">
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
          align="center"
          :formatter="formatCreate_time"
          label="创建时间"
        />
        <el-table-column prop="saleName" align="center" label="业务员"/>
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
        maccount: ""
      }
    };
  },
  methods: {
    formatCreate_time(row, column) {
      return (row.create_time = util.formatDate.format(
        new Date(row.create_time),
        "yyyy/MM/dd hh:MM:ss"
      ));
    },
    clickLook (index, row) {
      this.$router.push({ path: '/deal/shop/table5', query: { mid: row.mid.toString(), maccount: row.maccount } })
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
