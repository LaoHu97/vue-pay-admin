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
                :clearable = false
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
        <el-table-column prop="mname" label="商户名称"/>
        <el-table-column prop="sname" label="门店名称"/>
        <el-table-column
          :formatter="formatCreate_time"
          label="创建时间"
        />
        <el-table-column label="补录状态" :formatter="formatStatus"/>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="fillOrder(scope.$index, scope.row)">补录订单</el-button>
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
        background=""
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import { queryAwaitStatement, updateStatementData } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        startTime: "",
        endTime: "",
        dateTime: [new Date((new Date).getFullYear(), (new Date).getMonth(), (new Date).getDate()).getTime(), new Date((new Date).getFullYear(), (new Date).getMonth(), (new Date).getDate(), 23, 59, 59).getTime()],
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
      return (row.gmt_create = util.formatDate.format(
        new Date(row.settled_date),
        "yyyy/MM/dd hh:MM:ss"
      ));
    },
    formatStatus(row, column) {
      return row.status === '0' ? '未处理' : row.status === '1' ? '已处理' : '未知'
    },
    fillOrder(index, row) {
      this.$confirm("是否补录此订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            awaitId: row.id.toString(),
            date: row.settled_date.toString(),
            mid: row.mid.toString(),
            sid: row.sid.toString()
          }
          updateStatementData(para).then(res => {
            this.$message({
              type: "success",
              message: res.subMsg,
              showClose: true
            });
            this.getUsers()
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
          updateStatementData(para).then(res => {
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
      para.startTime = para.dateTime ? para.dateTime[0].toString() : "";
      para.endTime = para.dateTime ? para.dateTime[1].toString() : "";
      queryAwaitStatement(para).then(res => {
        this.users = res.data.awaitStatementList;
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
