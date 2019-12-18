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
<template>
  <section>
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="80px">
      <div class="search_top">
        <el-row>
          <el-col :span="6">
            <el-form-item label="名称查询" prop="mCode">
              <el-input v-model="filters.mCode" placeholder="请输入名称查询" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
              <el-button @click="addForm('filters')" round>新建广告组</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-dialog title="新建广告组" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="advertisingForm" label-position="left" label-width="120px">
        <el-form-item label="广告组名称">
          <el-input v-model="advertisingForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="advertisingForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="advertisingForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="machineCode" align="center" label="广告组名称" />
        <el-table-column prop="mname" align="center" label="编号" />
        <el-table-column prop="mname" align="center" label="描述" />
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="clickLook(scope.$index, scope.row)">查看</el-button>
            <el-button type="info" size="mini" @click="clickDetail(scope.$index, scope.row)">修改</el-button>
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
import { queryMerFaceMachine, modifyPwd, queryMachineDetail } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList],
  data() {
    return {
      filters: {
        type: 7,
        mCode: ""
      },
      dialogFormVisible: false,
      advertisingForm: {}
    };
  },
  methods: {
    addForm() {
      this.dialogFormVisible = true
    },
    getList() {
      let para = util.deepcopy(this.filters);
      para.pageNum = this.page.toString();
      para.numPerPage = 20;
      queryMerFaceMachine(para).then(res => {
        this.users = res.data.terminalList;
        this.total = res.data.totalCount;
      });
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
