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
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="90px">
      <div class="search_top">
        <el-row>
          <el-col :span="11">
            <el-form-item label="选择月份" prop="startTime">
              <el-date-picker
                v-model="filters.startTime"
                class="fixed_search_input"
                type="month"
                placeholder="开始月份"
                value-format="yyyy-MM"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
                      至
            </el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="filters.endTime"
                class="fixed_search_input"
                type="month"
                placeholder="结束月份"
                :picker-options="pickerOptions"
                value-format="yyyy-MM"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="选择渠道商" prop="agentId">
              <el-select
                v-model="filters.agentId"
                class="fixed_search_input"
                placeholder="请输入渠道商关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteAgent"
                :loading="agentLoading"
                @focus="changeAgent"
                clearable
              >
                <el-option
                  v-for="item in optionsAgent"
                  :key="item.id"
                  :value="item.id"
                  :label="item.company"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         <el-col :span="5">
            <el-form-item label="结算状态">
              <el-select v-model="filters.status" placeholder="请选择" class="fixed_search_input">
                <el-option
                  v-for="item in optionsFilStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="company" label="渠道商名称"/>
        <el-table-column prop="sum_total" label="有效笔数"/>
        <el-table-column prop="sum_amt" label="有效金额（￥）"/>
        <el-table-column prop="rebate_amt" label="分润金额（￥）"/>
        <el-table-column prop="settled_date" label="统计时间"/>
        <el-table-column :formatter="formatter_status" label="结算状态"/>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" :disabled="scope.row.status === '3'" @click="cilckStatus(scope.$index, scope.row)">结算状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="修改结算状态"
      :visible.sync="dialogVisibleStatus"
      width="350px">
      <el-form ref="statusForm" :model="statusForm" label-width="100px">
        <el-form-item label="选择结算状态" prop="agentId">
          <el-select v-model="statusForm.status" placeholder="请选择结算状态">
            <el-option
              v-for="item in optionsStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click="statusSubmit">确 定</el-button>
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
import {
  queryAgentRebates,
  agentRebate,
  queryAgentByName,
  updateRebateStatus
} from "@/api/api";
import { optionsPaymentAll } from "@/util/mockData.js";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        startTime: util.formatDate.format(new Date(new Date().getFullYear(), new Date().getMonth() - 1), 'yyyy-MM'),
        endTime: util.formatDate.format(new Date(new Date().getFullYear(), new Date().getMonth() - 1), 'yyyy-MM'),
        agentId: '',
        status: '1'
      },
      statusForm: {
        rebateId: '',
        status: ''
      },
      pickerOptions: {
        disabledDate: (time) => {
          let startTimeOne = Date.parse(new Date(util.formatDate.format(new Date(this.filters.startTime),
            'yyyy-MM-dd hh:mm:ss')));
          if (time.getTime() < startTimeOne) {
            return true;
          }
        }
      },
      optionsAgent: [],
      agentLoading: false,
      optionsAgentDialog: [],
      agentLoadingDialog: false,
      optionsStatus: [{
        value: '2',
        label: '结算中'
      },{
        value: '3',
        label: '已结算'
      }],
      optionsFilStatus: [{
        value: '1',
        label: '未结算'
      },{
        value: '2',
        label: '结算中'
      },{
        value: '3',
        label: '已结算'
      }],
      dialogVisibleStatus: false
    };
  },
  methods: {
    formatter_status(row, cloumn) {
      return row.status === '1' ? '未结算' : row.status === '2' ? '结算中' : row.status === '3' ? '已结算' : '未知'
    },
    statusSubmit() {
      if (!this.statusForm.status) {
        return this.$message({
          type: "warning",
          message: '请选择结算状态'
        });
      }
      let para = this.statusForm
      updateRebateStatus(para).then(res => {
        this.$message({
          type: "success",
          message: res.subMsg,
          showClose: true
        });
        this.dialogVisibleStatus = false
        this.getUsers()
      })
    },
    cilckStatus(index, row) {
      this.dialogVisibleStatus = true
      this.$nextTick(() => {
        this.statusForm.rebateId = row.id
      })
    },
    changeAgentDialog() {
      this.agentLoadingDialog = true;
      queryAgentByName({ userName: "" }).then(res => {
        this.agentLoadingDialog = false;
        this.optionsAgentDialog = res.data;
      });
    },
    remoteAgentDialog(query) {
      if (query !== "") {
        this.agentLoadingDialog = true;
        setTimeout(() => {
          this.agentLoadingDialog = false;
          queryAgentByName({
            userName: query
          }).then(res => {
            this.optionsAgentDialog = res.data;
          });
        }, 200)
      } else {
        this.optionsAgentDialog = [];
      }
    },
    changeAgent() {
      this.agentLoading = true;
      queryAgentByName({ userName: "" }).then(res => {
        this.agentLoading = false;
        this.optionsAgent = res.data;
      });
    },
    remoteAgent(query) {
      if (query !== "") {
        this.agentLoading = true;
        setTimeout(() => {
          this.agentLoading = false;
          queryAgentByName({
            userName: query
          }).then(res => {
            this.optionsAgent = res.data;
          });
        }, 200)
      } else {
        this.optionsAgent = [];
      }
    },
    getList() {
      this.listLoading = true
      let para = util.deepcopy(this.filters);
      para.pageNum = this.page.toString();
      para.agentId = para.agentId.toString()
      queryAgentRebates(para).then(res => {
        this.listLoading = false
        this.users = res.data.agentRebateList;
        this.total = res.data.totalCount;
      });
    }
  }
};
</script>
