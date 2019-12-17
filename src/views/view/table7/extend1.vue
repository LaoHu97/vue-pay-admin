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
            <el-form-item label="产品功能" prop="privilegeKey">
              <el-select v-model="filters.privilegeKey" clearable placeholder="请选择">
                <el-option
                  v-for="item in optionsPrivilegeKey"
                  :key="item.id"
                  :label="item.privilegeDesc"
                  :value="item.privilegeKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="选择商户" prop="mid">
              <el-select
                v-model="filters.mid"
                placeholder="请输入商户关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteMer"
                :loading="merLoading"
                clearable
                @focus="clickMer"
              >
                <el-option
                  v-for="item in optionsMer"
                  :key="item.mid"
                  :value="item.mid"
                  :label="item.mname"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
              <el-button @click="resetForm('filters')" round>开通</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="mname" align="center" label="商户名称" />
        <el-table-column prop="privilegeDesc" align="center" label="开通功能" />
        <el-table-column prop="openTime" align="center" label="开通时间" />
        <el-table-column prop="status" align="center" label="状态" :formatter="formatterStatus" />
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="clickClose(scope.$index, scope.row)">{{scope.row.status === 1 ? '关闭' : scope.row.status === 0 ? '开通' : '未知' }}</el-button>
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
import { queryAllPriDef, queryMerPrivilege, queryMerMname, opMerPrivilege } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        privilegeKey: null,
        mid: null
      },
      merLoading: false,
      optionsMer: [],

      optionsPrivilegeKey: []
    };
  },
  mounted() {
    this.getOptionsPrivilegeKey()
  },
  methods: {
    formatterStatus(row, column){
      return row.status === 1 ? '开通' : row.status === 0 ? '关闭' : '未知'
    },
    getOptionsPrivilegeKey() {
      queryAllPriDef().then(res => {
        this.optionsPrivilegeKey = res.data.privilegeList
      })
    },
    clickClose(index, row) {
      this.$confirm(`商户【${row.mname}】确定要${row.status === 1 ? '关闭' : row.status === 0 ? '开通' : '未知'}【${row.privilegeDesc}】？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = {
            status: row.status === 1 ? 0 : row.status === 0 ? 1 : '',
            mid: row.mid,
            privilegeKey: row.privilegeKey
          }
          opMerPrivilege(para).then(res => {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getUsers()
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    clickMer() {
      this.merLoading = true;
      queryMerMname({ mname: "" }).then(res => {
        this.merLoading = false;
        this.optionsMer = res.data;
      });
    },
    remoteMer(query) {
      if (query !== "") {
        this.merLoading = true;
        setTimeout(() => {
          this.merLoading = false;
          queryMerMname({
            mname: query
          }).then(res => {
            this.optionsMer = res.data;
          });
        }, 200);
      } else {
        this.optionsMer = [];
      }
    },
    getList() {
      let para = util.deepcopy(this.filters);
      para.pageNum = this.page.toString();
      para.numPerPage = 20;
      queryMerPrivilege(para).then(res => {
        this.users = res.data.privilegeList;
        this.total = res.data.totalCount;
      });
    },
    resetForm(formName) {
      if (!this.filters.privilegeKey) {
        this.$message({
          message: '请选择产品功能',
          type: 'warning'
        });
        return
      }
      if (!this.filters.mid) {
        this.$message({
          message: '请选择商户',
          type: 'warning'
        });
        return
      }
      let mName = this.optionsMer.find(data => {
        return data.mid === this.filters.mid
      }).mname
      let privilegeDesc = this.optionsPrivilegeKey.find(data => {
        return data.privilegeKey === this.filters.privilegeKey
      }).privilegeDesc
      this.$confirm(`商户【${mName}】确定要开通【${privilegeDesc}】？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let para = util.deepcopy(this.filters)
          para.status = 1
          opMerPrivilege(para).then(res => {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getUsers()
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });

    }
  }
};
</script>
<style scoped>
.checkbox_view {
  width: 100px;
  margin-left: 0;
  margin-top: 20px;
}
</style>
