
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
    <!--工具条-->
    <el-form :inline="true" :model="filters" label-position="left" label-width="100px">
      <div class="search_top">
        <el-row>
          <el-col :span="6" v-if="!$route.query.mid">
            <el-form-item label="所属商户">
              <el-select
                v-model="filters.mid"
                class="fixed_search_input"
                placeholder="请输入商户关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteMer"
                :loading="merLoading"
                @change="changeMer"
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
                @change="changeStore"
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
            <el-form-item label="所属款台">
              <el-select
                v-model="filters.eid"
                class="fixed_search_input"
                placeholder="请输入款台关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteEmp"
                :loading="empLoading"
                clearable
                @focus="clickEmp"
              >
                <el-option
                  v-for="item in optionsEmp"
                  :key="item.eid"
                  :value="item.eid"
                  :label="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端类型">
              <el-select
                v-model="filters.terminal_type"
                class="fixed_search_input"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in terminalTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select
                v-model="filters.apply_type"
                clearable
                class="fixed_search_input"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in applyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期时间">
              <el-date-picker
                v-model="filters.queryDateTime"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round>查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border="" style="width: 100%;">
        <el-table-column prop="mer_name" label="商户名称" min-width="120"></el-table-column>
        <el-table-column prop="store_name" label="门店名称" min-width="120"></el-table-column>
        <el-table-column prop="emp_name" label="款台名称" min-width="120"></el-table-column>
        <el-table-column
          prop="terminal_type"
          label="终端类型"
          min-width="120"
          :formatter="formatterTerminalType"
        ></el-table-column>
        <el-table-column prop="terminal_version" label="终端型号" min-width="120"></el-table-column>
        <el-table-column
          prop="gmt_create"
          label="创建时间"
          min-width="120"
          :formatter="formatterGmtCreate"
        ></el-table-column>
        <el-table-column align="center" label="审核状态" min-width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.apply_type === '1' ? 'warning' : scope.row.apply_type === '2' ? 'info': scope.row.apply_type === '3' ? 'success' : 'danger'"
              disable-transitions
            >{{formatterApplyType(scope.row, scope.$index)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="checkTerminal(scope.$index, scope.row)"
              :disabled="scope.row.apply_type !== '1'"
            >审 核</el-button>
            <el-button
              type="warning"
              size="mini"
              :disabled="scope.row.apply_type !== '3'"
              @click="unBind(scope.$index, scope.row)"
            >解 绑</el-button>
            <el-button type="info" size="mini" @click="handleDet(scope.$index, scope.row)">详 情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="page"
        background=""
        :page-size="20"
        :total="total"
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-row>
    <el-dialog title="终端审核" :visible.sync="dialogRefundVisible" width="420px">
      <el-form :model="formDialog" ref="formDialog">
        <el-form-item
          :label="formDialog.terminal_type === '13' ? '设备号' : '设备激活码'"
          prop="active_code"
          :rules="formDialog.terminal_type === '13' ? [{ required: true, message: '请输入设备号', trigger: 'blur' }] : [{ required: true, message: '请输入设备激活码', trigger: 'blur' }]"
          v-if="formDialog.terminal_type !== '11' && formDialog.apply_type === '3'"
        >
          <el-input
            v-model="formDialog.active_code"
            :placeholder="formDialog.terminal_type === '13' ? '请输入设备号' : '请输入设备激活码'"
          />
        </el-form-item>
        <el-form-item
          label="设备号"
          prop="mCode"
          :rules="[{ required: true, message: '请输入设备号', trigger: 'blur' }]"
          v-if="formDialog.terminal_type !== '13' && formDialog.apply_type === '3'"
        >
          <el-input v-model="formDialog.mCode" placeholder="请输入设备号"/>
        </el-form-item>
        <el-form-item
          label="商户号"
          prop="reserve1"
          :rules="[{ required: true, message: '请输入商户号', trigger: 'blur' }]"
          v-if="formDialog.terminal_type !== '13' && formDialog.apply_type === '3'"
        >
          <el-input v-model="formDialog.reserve1" placeholder="请输入商户号"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRefundVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRefund('formDialog')">确 定</el-button>
      </span>
    </el-dialog>
    <!--详情界面-->
    <el-dialog title="终端配置详情" :visible.sync="detFormVisible" width="30%">
      <el-form :model="detForm" label-width="120px" label-position="left">
        <el-form-item label="所属门店：">
          <span>{{detForm.store_name}}</span>
        </el-form-item>
        <el-form-item label="所属款台：">
          <span>{{detForm.emp_name}}</span>
        </el-form-item>
        <el-form-item label="审核状态：">
          <span>{{formatterApplyType(detForm)}}</span>
        </el-form-item>
        <el-form-item label="终端类型：">
          <span>{{formatterTerminalType(detForm)}}</span>
        </el-form-item>
        <el-form-item label="编号：">
          <span>{{detForm.SN}}</span>
        </el-form-item>
        <el-form-item label="型号：">
          <span>{{detForm.terminal_version}}</span>
        </el-form-item>
        <el-form-item label="设备激活码：" v-if="detForm.active_code">
          <span>{{detForm.active_code}}</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          <span>{{formatterGmtCreate(detForm)}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click.native="detFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import * as util from "@/util/util.js";
import * as async from "@/util/async-validator/addTerminalFormRules";
import {
  terminalTypeOptions,
  terminalVersionOptions,
  applyTypeOptions
} from "@/util/mockData.js";
import getUsersList from "@/mixins/Users";
import {
  queryTerminals,
  queryTerminal,
  updateTerminal,
  selectStoreList,
  selectEmpsBySid,
  queryMerMname
} from "@/api/api";
export default {
  mixins: [getUsersList],
  data() {
    return {
      filters: {
        queryDateTime: "",
        mid: this.$route.query.mid || "",
        sid: "",
        eid: "",
        terminal_type: "",
        apply_type: ""
      },
      detFormVisible: false,
      terminalTypeOptions: terminalTypeOptions,
      terminalVersionOptions: terminalVersionOptions,
      applyTypeOptions: applyTypeOptions,
      detForm: {},
      empLoading: false,
      storeLoading: false,
      merLoading: false,
      optionsEmp: [],
      optionsStore: [],
      optionsMer: [],
      editFormRules: async.addTerminalFormRules,
      dialogRefundVisible: false,
      formDialog: {
        mid: "",
        id: "",
        eid: "",
        terminal_type: "",
        apply_type: "3",
        active_code: "",
        mCode: "",
        reserve1: ""
      },
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
    formatterApplyType(row, column) {
      return row.apply_type === "1"
        ? "审核中"
        : row.apply_type === "2"
          ? "已解绑"
          : row.apply_type === "3"
            ? "已绑定"
            : "未知";
    },
    formatterTerminalType(row, column) {
      return row.terminal_type === "11"
        ? "富友POS"
        : row.terminal_type === "12"
          ? "新大陆POS"
          : row.terminal_type === "13"
            ? "微收银"
            : "未知";
    },
    formatterGmtCreate(row, column) {
      return (row.gmt_create = util.formatDate.format(
        new Date(row.gmt_create),
        "yyyy/MM/dd hh:mm:ss"
      ));
    },
    changeStore() {
      this.filters.eid = ''
    },
    changeMer() {
      this.filters.sid = ''
      this.filters.eid = ''
    },
    // 解绑
    unBind(index, row) {
      this.$confirm("此操作将解除终端绑定, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.formDialog.apply_type = "2";
          let c = util.deepcopy(row);
          this.formDialog.id = c.id;
          this.formDialog.eid = c.eid;
          this.formDialog.terminal_type = c.terminal_type;
          this.$nextTick(() => {
            let para = this.formDialog;
            para.mid = this.$route.query.mid;
            updateTerminal(para).then(res => {
              this.dialogRefundVisible = false;
              this.$message({
                message: res.subMsg,
                type: "success"
              });
              this.getUsers();
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submitRefund(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = this.formDialog;
          updateTerminal(para).then(res => {
            this.dialogRefundVisible = false;
            this.getUsers();
            this.$refs[formName].resetFields();
            this.$message({
              message: res.subMsg,
              type: "success"
            });
          });
        }
      });
    },
    checkTerminal(index, row) {
      this.dialogRefundVisible = true;
      this.$nextTick(() => {
        let c = util.deepcopy(row);
        this.formDialog.mid = c.mid;
        this.formDialog.id = c.id;
        this.formDialog.eid = c.eid;
        this.formDialog.terminal_type = c.terminal_type;
        this.formDialog.apply_type = "3";
        this.$refs.formDialog.resetFields();
      });
    },
    //款台远程搜索
    clickEmp: function() {
      this.empLoading = true;
      let para = {
        mid: this.$route.query.mid,
        storeId: this.filters.sid.toString() || "",
        ename: ""
      };
      selectEmpsBySid(para).then(res => {
        this.empLoading = false;
        let { status, data } = res;
        this.optionsEmp = data.emplyeeList;
      });
    },
    remoteEmp(query) {
      if (query !== "") {
        this.empLoading = true;
        setTimeout(() => {
          this.empLoading = false;
          let para = {
            mid: this.$route.query.mid,
            storeId: this.filters.sid.toString() || "",
            ename: query
          };
          selectEmpsBySid(para).then(res => {
            this.optionsEmp = res.data.emplyeeList;
          });
        }, 200);
      } else {
        this.optionsEmp = [];
      }
    },
    clickStore() {
      this.storeLoading = true;
      selectStoreList({ mid: this.$route.query.mid || this.filters.mid }).then(
        res => {
          this.storeLoading = false;
          let { status, data } = res;
          this.optionsStore = data.storeList;
        }
      );
    },
    remoteStore(query) {
      if (query !== "") {
        this.storeLoading = true;
        setTimeout(() => {
          this.storeLoading = false;
          selectStoreList({
            sname: query,
            mid: this.$route.query.mid || this.filters.mid
          }).then(res => {
            let { status, data } = res;
            this.optionsStore = data.storeList;
          });
        }, 200);
      } else {
        this.optionsStore = [];
      }
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
    //获取用户列表
    getList() {
      this.listLoading = true;
      let para = util.deepcopy(this.filters);
      para.pageNum = this.page;
      para.start_time = para.queryDateTime ? para.queryDateTime[0] : "";
      para.end_time = para.queryDateTime ? para.queryDateTime[1] : "";
      queryTerminals(para).then(res => {
        this.listLoading = false;
        if (res.code === "000000") {
          this.total = res.data.totalCount;
          this.users = res.data.terminalsList;
        }
      });
    },
    //显示详情界面
    handleDet: function(index, row) {
      this.detFormVisible = true;
      queryTerminal({ id: row.id }).then(res => {
        if (res.code === "000000") {
          this.detForm = res.data;
        }
      });
    }
  }
};
</script>