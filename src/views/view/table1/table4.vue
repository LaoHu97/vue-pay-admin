<style scoped>
.search_top {
  background: #f2f2f2;
  margin: 20px 0;
  padding: 24px 10px 0 10px;
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
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="98px">
      <div class="search_top">
        <el-row>
          <el-col :span="9">
            <el-form-item label="款台名称" prop="username">
              <el-input
                v-model="filters.username"
                class="fixed_search_input"
                placeholder="请输入款台名称关键字"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="款台账号" prop="account">
              <el-input
                v-model="filters.account"
                class="fixed_search_input"
                placeholder="请输入款台账号查询"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
              <el-button @click="resetForm('filters')" round>重置</el-button>
              <el-button
                type="success"
                round
                icon="el-icon-circle-plus"
                @click="openStoreDialog"
              >新增款台</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table
        :data="users"
        border=""
        highlight-current-row
        v-loading="listLoading"
        style="width: 100%;"
      >
        <el-table-column prop="username" label="款台名称" min-width="120"></el-table-column>
        <el-table-column prop="account" label="登录帐号" min-width="120"></el-table-column>
        <el-table-column label="款台状态" min-width="80">
          <template slot-scope="scope">
            <el-switch
              name="value"
              @change="test(scope.$index, scope.row)"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="二维码" width="100">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleCode(scope.$index, scope.row)">二维码</el-button>
          </template>
        </el-table-column>
        <el-table-column label="会员支付二维码" width="140">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="handleVipCode(scope.$index, scope.row)"
            >会员支付二维码</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleReset(scope.$index, scope.row)">密码重置</el-button>
            <el-button type="warning" size="mini" @click="handleModify(scope.$index, scope.row)">修改</el-button>
            <el-button type="info" size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogType ? '新增款台' : '修改款台'"
      :visible.sync="addStoreDialogVisible"
      width="600px"
      center
    >
      <el-form
        :model="addStoreForm"
        :rules="addStoreFormRules"
        ref="addStoreForm"
        label-position="left"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="款台名称" prop="username">
              <el-input v-model="addStoreForm.username" placeholder="请输入2-20个字符或数字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="addStoreForm.phone" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系邮箱" prop="email">
              <el-input v-model="addStoreForm.email" placeholder="请输入邮箱地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属门店" prop="storeId">
              <el-select
                v-model="addStoreForm.storeId"
                class="fixed_search_input"
                placeholder="请选择所属门店"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteStore"
                :loading="storeLoading"
                clearable
                @focus="clickStore"
              >
                <el-option
                  v-for="item in optionsStore"
                  :key="item.id"
                  :value="item.id"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="扫呗终端ID" prop="terminal_id">
              <el-input v-model="addStoreForm.terminal_id" placeholder="请输入扫呗终端ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付宝操作员编号" prop="ali_operation_id">
              <el-input v-model="addStoreForm.ali_operation_id" placeholder="请输入支付宝操作员编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="微收银设备号" prop="wsy_num">
              <el-input v-model="addStoreForm.wsy_num" placeholder="请输入微收银设备号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新大陆设备号" prop="ndl_num">
              <el-input v-model="addStoreForm.ndl_num" placeholder="请输入新大陆设备号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="富友设备号" prop="fuiou_id">
              <el-input v-model="addStoreForm.fuiou_id" placeholder="请输入富友设备号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStoreDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogType" @click="addStoreSubmit('addStoreForm')">提 交</el-button>
        <el-button type="primary" v-else @click="editStoreSubmit('addStoreForm')">修 改</el-button>
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
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row>
  </section>
</template>

<script>
import {
  queryAdminEmp,
  addEmployee,
  updateAdminStore,
  resetStorePwd,
  selectStoreList
} from "@/api/api";
import * as util from "@/util/util.js";
import * as async from "@/util/async-validator/addEmpFormRules";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        username: "",
        account: ""
      },
      addStoreDialogVisible: false,
      addStoreForm: {
        mid: this.$route.query.mid,
        username: "",
        phone: "",
        email: "",
        storeId: "",
        terminal_id: "",
        ali_operation_id: "",
        wsy_num: "",
        ndl_num: "",
        fuiou_id: ""
      },
      addStoreFormRules: async.addEmpFormRules,
      dialogType: false,
      storeLoading: false
    };
  },
  methods: {
    handleReset(index, row) {
      this.$prompt("请输入密码", "密码重置", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "密码格式不正确",
        inputValue: "123456"
      })
        .then(({ value }) => {
          let para = {
            sid: row.id,
            password: this.md5(value + row.saccount)
          };
          resetStorePwd(para).then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    getList() {
      let para = {
        mid: this.$route.query.mid,
        pageNum: this.page.toString(),
        username: this.filters.username,
        account: this.filters.account
      };
      this.listLoading = true;
      queryAdminEmp(para).then(res => {
        this.total = res.data.totalCount;
        this.users = res.data.employeeList;
        this.listLoading = false;
      });
    },
    openStoreDialog() {
      this.addStoreDialogVisible = true;
      this.dialogType = true;
      this.$nextTick(() => {
        this.$refs.addStoreForm.resetFields();
        console.log(this.addStoreForm);
      });
    },
    editStore(index, row) {
      this.addStoreDialogVisible = true;
      this.dialogType = false;
      this.$nextTick(() => {
        this.addStoreForm = c;
      });
    },
    addStoreSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        let para = util.deepcopy(this.addStoreForm);
        para.storeId = para.storeId.toString()
        addEmployee(para).then(res => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getUsers();
          }
          this.addStoreDialogVisible = false;
        });
      });
    },
    editStoreSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        let para = util.deepcopy(this.addStoreForm);
        para.storeId = para.storeId.toString()
        updateAdminStore(para).then(res => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getUsers();
          }
          this.addStoreDialogVisible = false;
        });
      });
    },
    clickStore() {
      this.storeLoading = true;
      selectStoreList({ mid: this.$route.query.mid }).then(res => {
        this.storeLoading = false;
        let { status, data } = res;
        this.optionsStore = data.storeList;
      });
    },
    remoteStore(query) {
      if (query !== "") {
        this.storeLoading = true;
        setTimeout(() => {
          this.storeLoading = false;
          selectStoreList({
            sname: query
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.storeList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
    }
  }
};
</script>
