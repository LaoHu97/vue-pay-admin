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
          <el-col :span="6">
            <el-form-item label="所属门店">
              <el-select
                v-model="filters.sid"
                class="fixed_search_input"
                placeholder="门店名称"
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
            <el-form-item label="所属款台">
              <el-select
                v-model="filters.eid"
                class="fixed_search_input"
                placeholder="款台名称"
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
          <el-col :span="6">
            <el-form-item label="申请类型">
              <el-select v-model="filters.apply_type" class="fixed_search_input" placeholder="请选择">
                <el-option
                  v-for="item in applyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="日期时间">
              <el-date-picker
                v-model="filters.queryDateTime"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round>查询</el-button>
              <el-button type="primary" @click="printAdd" round>新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border="" style="width: 100%;">
        <el-table-column prop="id" label="终端ID" min-width="80"></el-table-column>
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
        <el-table-column align="center" label="申请类型" min-width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.apply_type === '1' ? 'warning' : scope.row.apply_type === '2' ? 'info': scope.row.merchant_status === '3' ? 'success' : 'danger'"
              disable-transitions
            >{{formatterApplyType(scope.row, scope.$index)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <!-- <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button> -->
            <el-button
              type="warning"
              size="mini"
              @click="checkTerminal(scope.$index, scope.row)"
            >审 核</el-button>
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
        :page-size="20"
        :total="total"
        style="text-align:center;background:#fff;padding:15px;"
      ></el-pagination>
    </el-row>
    <el-dialog title="终端审核" :visible.sync="dialogRefundVisible" width="420px">
      <el-form :model="formDialog" ref="formDialog">
        <el-form-item prop="apply_type">
          <el-radio v-model="formDialog.apply_type" label="3">通过</el-radio>
          <el-radio v-model="formDialog.apply_type" label="2">解绑</el-radio>
        </el-form-item>
        <el-form-item
          label="激活码"
          prop="active_code"
          :rules="[{ required: true, message: '请输入激活码', trigger: 'blur' }]"
          v-if="formDialog.terminal_type !== '11'"
        >
          <el-input
            v-model="formDialog.active_code"
            placeholder="请输入激活码"
          />
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
        <el-form-item label="申请类型：">
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
        <el-form-item label="激活码：">
          <el-tag
            :type="detForm.active_code ? 'success' : 'danger'"
          >{{detForm.active_code || '暂未审核或审核驳回'}}</el-tag>
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
  selectEmpsBySid
} from "@/api/api";
export default {
  mixins: [getUsersList],
  data() {
    return {
      filters: {
        queryDateTime: "",
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
      optionsEmp: [],
      optionsStore: [],
      editFormRules: async.addTerminalFormRules,
      dialogRefundVisible: false,
      formDialog: {
        id: '',
        terminal_type: '',
        apply_type: '3',
        active_code: ''
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
            ? "插件"
            : "未知";
    },
    formatterGmtCreate(row, column) {
      return (row.gmt_create = util.formatDate.format(
        new Date(row.gmt_create),
        "yyyy/MM/dd hh:mm:ss"
      ));
    },
    submitRefund (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let para = this.formDialog
          updateTerminal(para).then(res => {
            this.dialogRefundVisible = false
            this.getUsers()
            this.$refs[formName].resetFields()
            this.$message({
              message: '审核完成',
              type: 'success'
            })
          })
        }
      })
    },
    checkTerminal(index, row) {
      this.dialogRefundVisible = true;
      this.$nextTick(() => {
        let c = util.deepcopy(row)
        this.formDialog.id = c.id;
        this.formDialog.terminal_type = c.terminal_type
      })
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
    },
    editStatus(index, row) {
      this.$confirm("此操作将修改款台状态, 确定修改?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          let para = {
            printId: row.id,
            isOpen: row.isOpen
          };
          updatePStatus(para)
            .then(res => {
              this.$message({
                type: "success",
                message: res.msg
              });
            })
            .catch(() => {
              this.getUsers();
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
    },
    //显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true;
      let form = util.deepcopy(row);
      form.mCode = form.machineCode;
      form.mKey = form.machineKey;
      this.editForm = form;
      this.optionsEmp = [{ eid: form.eid, value: form.ename }];
    },
    //显示新增界面
    printAdd() {
      this.editFormVisible = true;
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields();
      }
    },
    //新增
    addSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示").then(() => {
            this.editLoading = true;
            let para = util.deepcopy(this.editForm);
            addTerminal(para).then(res => {
              this.editLoading = false;
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>