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
            <el-form-item label="商户账号" prop="maccount">
              <el-input v-model="filters.maccount" placeholder="请输入商户账号" />
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
        <el-table-column prop="createTime" align="center" label="创建时间" />
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="clickLook(scope.$index, scope.row)">功能管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="选择功能" :visible.sync="dialogVisible" width="450px">
      <div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox class="checkbox_view" border label="OPEN">开通支付</el-checkbox>
          <el-checkbox class="checkbox_view" border label="EXEMPT">退款免密</el-checkbox>
          <el-checkbox class="checkbox_view" border label="AUTH">预授权</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiltCheckbox">确 定</el-button>
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
import { privilegeList, privilegeListedit } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        mname: "",
        maccount: ""
      },
      dialogVisible: false,
      checkList: [],
      mid: ""
    };
  },
  methods: {
    submiltCheckbox() {
      this.$confirm("确认操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            privilegeList: this.checkList,
            mid: this.mid
          }
          privilegeListedit(para).then(res => {
            this.getUsers()
            this.$message({
              type: "success",
              message: res.message
            });
            this.dialogVisible = false
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    clickLook(index, row) {
      this.dialogVisible = true;
      this.mid = row.mid;
      this.checkList = row.privilegeList
    },
    getList() {
      let para = this.filters;
      para.pageNum = this.page.toString();
      para.numPerPage = 20;
      privilegeList(para).then(res => {
        this.users = res.data.privilegeList;
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
