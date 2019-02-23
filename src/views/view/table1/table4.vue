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
    <el-button size="small" round @click="historyGo" style="margin-top:15px;">返回</el-button>
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="98px">
      <div class="search_top">
        <el-row>
          <el-col :span="6" v-if="!$route.query.sid">
            <el-form-item label="所属门店">
              <el-select
                v-model="filters.sid"
                class="fixed_search_input"
                placeholder="请输入门店关键字查询"
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
          <el-col :span="6">
            <el-form-item label="款台名称" prop="username">
              <el-input
                v-model="filters.username"
                class="fixed_search_input"
                placeholder="请输入款台名称关键字"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
              <el-button
                type="success"
                round
                icon="el-icon-circle-plus"
                @click="openStoreDialog"
              >新增款台</el-button>
              <el-button type="primary" @click="clickEmp" v-show="$route.query.sid">款台数量</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table
        :data="users"
        border
        highlight-current-row
        v-loading="listLoading"
        style="width: 100%;"
      >
        <el-table-column prop="username" label="款台名称" min-width="120"></el-table-column>
        <el-table-column prop="account" label="款台编号" min-width="120"></el-table-column>
        <el-table-column prop="linkman" label="联系人" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
        <el-table-column align="center" label="二维码" width="100">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleCode(scope.$index, scope.row)">二维码</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="会员支付二维码" width="140">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="handleVipCode(scope.$index, scope.row)"
            >会员二维码</el-button>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="操作" width="260">
          <template slot-scope="scope">
            <!-- <el-button type="danger" size="mini" @click="handleReset(scope.$index, scope.row)">密码重置</el-button> -->
            <el-button type="warning" size="mini" @click="handleModify(scope.$index, scope.row)">修改</el-button>
            <el-button type="info" size="mini" @click="handleDetails(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 二维码 -->
    <el-dialog title="二维码" :visible.sync="codeDialog" center width="350px">
      <el-form :model="codeForm">
        <img :src="codeForm.code" alt="二维码" width="100%">
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="codeClick">点击下载</el-button>
      </span>
    </el-dialog>
    <!-- 二维码 -->
    <!-- <el-dialog title="会员二维码" :visible.sync="codeVipDialog" center width="350px">
      <el-form :model="codeVipForm">
        <img :src="codeVipForm.code" alt="二维码" width="100%">
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="codeVipClick">点击下载</el-button>
      </span>
    </el-dialog> -->
    <!--详情界面-->
    <el-dialog title="款台详情" :visible.sync="detailsFormVisible" width="450px">
      <el-form :model="detailsForm" label-width="120px" ref="detailsForm" label-position="left">
        <el-form-item label="款台名称：">
          <span>{{detailsForm.username}}</span>
        </el-form-item>
        <el-form-item label="款台编号：">
          <span>{{detailsForm.account}}</span>
        </el-form-item>
        <el-form-item label="联系人：">
          <span>{{detailsForm.linkman}}</span>
        </el-form-item>
        <el-form-item label="手机号：">
          <span>{{detailsForm.phone}}</span>
        </el-form-item>
        <el-form-item label="邮箱：">
          <span>{{detailsForm.email}}</span>
        </el-form-item>
        <el-form-item label="所属门店：">
          <span>{{detailsForm.store_name}}</span>
        </el-form-item>
        <el-form-item label="对接终端号：">
          <span>{{detailsForm.reverse1}}</span>
        </el-form-item>
        <el-form-item label="对接token：">
          <span>{{detailsForm.etoken}}</span>
        </el-form-item>
        <!-- <el-form-item label="扫呗终端ID：">
          <span>{{detailsForm.terminal_id}}</span>
        </el-form-item>
        <el-form-item label="微收银设备号：">
          <span>{{detailsForm.device_num}}</span>
        </el-form-item>
        <el-form-item label="新大陆设备号：">
          <span>{{detailsForm.newland_num}}</span>
        </el-form-item>
        <el-form-item label="富友设备号：">
          <span>{{detailsForm.fuiou_num}}</span>
        </el-form-item> -->
      </el-form>
    </el-dialog>
    <el-dialog
      :title="dialogType ? '新增款台' : '修改款台'"
      :visible.sync="addEmpDialogVisible"
      width="600px"
      center
    >
      <el-form
        :model="addEmpForm"
        :rules="addEmpFormRules"
        ref="addEmpForm"
        label-position="left"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="款台名称" prop="username">
              <el-input v-model="addEmpForm.username" placeholder="请输入2-20个字符或数字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="addEmpForm.linkman" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="addEmpForm.phone" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系邮箱" prop="email">
              <el-input v-model="addEmpForm.email" placeholder="请输入邮箱地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属门店" prop="storeId">
              <el-select
                v-model="addEmpForm.storeId"
                class="fixed_search_input"
                placeholder="请输入门店关键字查询"
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
          <!-- <el-col :span="12">
            <el-form-item label="扫呗终端ID" prop="terminal_id">
              <el-input v-model="addEmpForm.terminal_id" placeholder="请输入扫呗终端ID"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付宝操作员编号" prop="ali_operation_id">
              <el-input v-model="addEmpForm.ali_operation_id" placeholder="请输入支付宝操作员编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微收银设备号" prop="wsy_num">
              <el-input v-model="addEmpForm.wsy_num" placeholder="请输入微收银设备号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="新大陆设备号" prop="ndl_num">
              <el-input v-model="addEmpForm.ndl_num" placeholder="请输入新大陆设备号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="富友设备号" prop="fuiou_id">
              <el-input v-model="addEmpForm.fuiou_id" placeholder="请输入富友设备号"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEmpDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogType" @click="addStoreSubmit('addEmpForm')">提 交</el-button>
        <el-button type="primary" v-else @click="editStoreSubmit('addEmpForm')">修 改</el-button>
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
  resetEmpPwd,
  selectStoreList,
  adminGetTwoCode,
  queryEmployeeDetail,
  getEmpMemCode,
  updateAdminEmp,
  updateChangeCount,
  queryChangeCount
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
        account: "",
        sid: ""
      },
      addEmpDialogVisible: false,
      addEmpForm: {
        mid: this.$route.query.mid,
        username: "",
        phone: "",
        email: "",
        storeId: "",
        terminal_id: "",
        ali_operation_id: "",
        wsy_num: "",
        ndl_num: "",
        fuiou_id: "",
        linkman: ""
      },
      addEmpFormRules: async.addEmpFormRules,
      dialogType: false,
      storeLoading: false,
      codeDialog: false,
      codeForm: {
        code: ""
      },
      // codeVipDialog: false,
      // codeVipForm: {
      //   code: ""
      // },
      detailsFormVisible: false,
      detailsForm: {},
      optionsStore: []
    };
  },
  methods: {
    historyGo() {
      if (this.$route.query.sid) {
        this.$router.go(-2) 
      }else{
        this.$router.go(-1) 
      }
    },
    clickEmp() {
      let para = {
        store_id: this.$route.query.sid,
        level: '2'
      }
      queryChangeCount(para).then(res => {
        this.$prompt('请输入门店数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]+$/,
          inputErrorMessage: '数量格式不正确',
          inputValue: res.data.counts
        }).then(({ value }) => {
          let para = {
            store_id: this.$route.query.sid,
            level: '2',
            counts: value
          }
          updateChangeCount(para).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            });  
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });  
        });
      })
    },
    handleModify(index, row) {
      this.addEmpDialogVisible = true;
      this.dialogType = false;
      this.$nextTick(() => {
        let c = util.deepcopy(row);
        this.addEmpForm = c;
        this.addEmpForm.wsy_num = row.device_num
        this.addEmpForm.linkman = row.linkman
        this.optionsStore = [
          {
            id: row.storeId,
            value: row.store_name
          }
        ];
      });
    },
    handleDetails(index, row) {
      this.detailsFormVisible = true;
      this.$nextTick(() => {
        queryEmployeeDetail({ eid: row.eid.toString() }).then(res => {
          this.detailsForm = res.employee;
          this.detailsForm.store_name = row.store_name;
          this.detailsForm.fuiou_num = res.fuiou_num;
          this.detailsForm.newland_num = res.newland_num;
          this.detailsForm.saobei_num = res.saobei_num;
        });
      });
    },
    // handleVipCode(index, row) {
    //   this.codeVipDialog = true;
    //   this.$nextTick(() => {
    //     this.codeVipForm.code = `${getEmpMemCode}?mid=${row.mid}&storeId=${
    //       row.storeId
    //     }&eid=${row.eid}`;
    //   });
    // },
    codeVipClick() {
      window.location.href = this.codeVipForm.code;
    },
    handleCode(index, row) {
      this.codeDialog = true;
      this.$nextTick(() => {
        this.codeForm.code = `${adminGetTwoCode}?mid=${row.mid}&sid=${
          row.storeId
        }&eid=${row.eid}`;
      });
    },
    codeClick() {
      window.location.href = this.codeForm.code;
    },
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
            eid: row.eid.toString(),
            password: this.md5(value + row.account)
          };
          resetEmpPwd(para).then(res => {
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
        sid: this.$route.query.sid || this.filters.sid,
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
      this.addEmpDialogVisible = true;
      this.dialogType = true;
      this.$nextTick(() => {
        this.addEmpForm = {
          mid: this.$route.query.mid,
          username: "",
          phone: "",
          email: "",
          storeId: "",
          terminal_id: "",
          ali_operation_id: "",
          wsy_num: "",
          ndl_num: "",
          fuiou_id: "",
          linkman: ""
        },
        this.$refs.addEmpForm.resetFields();
      });
    },
    addStoreSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        let para = util.deepcopy(this.addEmpForm);
        para.storeId = para.storeId.toString();
        addEmployee(para).then(res => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getUsers();
          }
          this.addEmpDialogVisible = false;
        });
      });
    },
    editStoreSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        let para = util.deepcopy(this.addEmpForm);
        para.storeId = para.storeId.toString();
        para.eid = para.eid.toString();
        updateAdminEmp(para).then(res => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getUsers();
          }
          this.addEmpDialogVisible = false;
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
