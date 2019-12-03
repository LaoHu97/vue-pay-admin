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
              <el-input v-model="filters.mname" placeholder="请输入关键字查询" />
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
        <el-table-column prop="mname" align="center" label="商户名称" />
        <el-table-column prop="printname" align="center" label="设备名称" />
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="clickLook(scope.$index, scope.row)">密码重置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { queryMerFaceMachine, modifyPwd } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        mname: ""
      }
    };
  },
  methods: {
    clickLook(index, row) {
      this.$confirm("是否将密码重置为123456?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            isReset: true,
            mCode: row.machineCode,
            type: row.type
          }
          modifyPwd(para).then(res => {
            this.getUsers()
            this.$message({
              type: "success",
              message: res.message
            });
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    getList() {
      let para = this.filters;
      para.pageNum = this.page.toString();
      para.numPerPage = 20;
      queryMerFaceMachine(para).then(res => {
        this.users = res.data.terminalList;
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
<style scoped>
.checkbox_view {
  width: 100px;
  margin-left: 0;
  margin-top: 20px;
}
</style>
