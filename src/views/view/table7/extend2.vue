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
            <el-form-item label="设备类型" prop="type">
              <el-select v-model="filters.type" placeholder="请选择设备类型">
                <el-option label="青蛙设备" :value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号" prop="mCode">
              <el-input v-model="filters.mCode" placeholder="请输入设备编号" />
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
        <el-table-column prop="machineCode" align="center" label="设备编号" />
        <el-table-column prop="type" align="center" label="设备类型" :formatter="formatterType" />
        <el-table-column prop="mname" align="center" label="所属商户" />
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="clickLook(scope.$index, scope.row)">密码重置</el-button>
            <el-button type="info" size="mini" @click="clickDetail(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="设备详情" :visible.sync="detailFormVisible" width="30%">
      <el-form :model="detailForm" label-width="120px" label-position="left">
        <el-form-item label="所属门店：">
          <span>{{detailForm.sname || '未绑定'}}</span>
        </el-form-item>
        <el-form-item label="所属款台：">
          <span>{{detailForm.ename || '未绑定'}}</span>
        </el-form-item>
        <el-form-item label="设备名称：">
          <span>{{detailForm.printname}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click.native="detailFormVisible = false">关 闭</el-button>
      </div>
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
import { queryMerFaceMachine, modifyPwd, queryMachineDetail } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";
import { log } from 'util';

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        type: 7,
        mCode: ""
      },

      detailFormVisible: false,
      detailForm: {}
    };
  },
  methods: {
    formatterType(row, column){
      return row.type === 7 ? '青蛙设备' : ''
    },
    clickDetail(index, row){
      this.detailFormVisible = true
      queryMachineDetail({mCode: row.machineCode, type: row.type}).then(res => {
        this.detailForm = res.data.printList[0]
      })
    },
    clickLook(index, row) {
      this.$confirm("是否将密码重置为888888?", "提示", {
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
      let para = util.deepcopy(this.filters);
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
