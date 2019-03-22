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
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="100px">
      <div class="search_top">
        <el-row>
          <el-col :span="6">
            <el-form-item label="渠道商名称">
              <el-input v-model="filters.company" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="渠道商账号">
              <el-input v-model="filters.userId" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
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
        <el-table-column prop="userName" label="负责人"/>
        <el-table-column prop="userId" label="渠道商账号"/>
        <el-table-column :formatter="formatter_create_time" label="创建时间"/>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="mini"
              @click="handleModify(scope.$index, scope.row)"
            >修改</el-button>
            <el-button type="success" size="mini" @click="cilckRate(scope.$index, scope.row)">费率配置</el-button>
            <el-button type="danger" size="mini" @click="handleReset(scope.$index, scope.row)">密码重置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="费率配置（‰）"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form ref="rebateForm" :model="rebateForm" label-width="190px" label-position="top">
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信费率（最大值：50）" prop="wxRate">
              <el-input-number v-model="rebateForm.wxRate" :precision="1" :step="0.1" :min="0" :max="50"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提成比例" prop="wxScale">
              <el-select v-model="rebateForm.wxScale" placeholder="请选择">
                <el-option
                  v-for="item in optionsCommission"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付宝费率（最大值：50）" prop="aliRate">
              <el-input-number v-model="rebateForm.aliRate" :precision="1" :step="0.1" :min="0" :max="50"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提成比例" prop="aliScale">
              <el-select v-model="rebateForm.aliScale" placeholder="请选择">
                <el-option
                  v-for="item in optionsCommission"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="贷记卡费率（最大值：500）" prop="creditRate">
              <el-input-number v-model="rebateForm.creditRate" :precision="1" :step="0.1" :min="0" :max="500"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提成比例" prop="creditScale">
              <el-select v-model="rebateForm.creditScale" placeholder="请选择">
                <el-option
                  v-for="item in optionsCommission"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银联费率（最大值：6）" prop="unionpayRate">
              <el-input-number v-model="rebateForm.unionpayRate" :precision="1" :step="0.1" :min="0" :max="6"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提成比例" prop="unionpayScale">
              <el-select v-model="rebateForm.unionpayScale" placeholder="请选择">
                <el-option
                  v-for="item in optionsCommission"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="借记卡费率（最大值：500）" prop="debitRate">
              <el-input-number v-model="rebateForm.debitRate" :precision="1" :step="0.1" :min="0" :max="500"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提成比例" prop="debitScale">
              <el-select v-model="rebateForm.debitScale" placeholder="请选择">
                <el-option
                  v-for="item in optionsCommission"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rebateSubmit">确 定</el-button>
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
  queryAgentList,
  agentRateConfigView,
  updateAgentRateConfig,
  resetAgentPwd
} from "@/api/api";
import { optionsPaymentAll } from "@/util/mockData.js";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        company: '',
        userId: ''
      },
      rebateForm: {
        agentId: '',
        aliRate: '',
        creditRate: '',
        debitRate: '',
        unionpayRate: '',
        wxRate: '',

        wxScale: '',
        aliScale: '',
        debitScale: '',
        creditScale: '',
        unionpayScale: ''
      },
      dialogVisible: false,
      optionsCommission:[
        { value: '0', label: '0%'},
        { value: '0.05', label: '5%'},
        { value: '0.1', label: '10%'},
        { value: '0.15', label: '15%'},
        { value: '0.2', label: '20%'},
        { value: '0.25', label: '25%'},
        { value: '0.3', label: '30%'},
        { value: '0.35', label: '35%'},
        { value: '0.4', label: '40%'},
        { value: '0.45', label: '45%'},
        { value: '0.5', label: '50%'},
        { value: '0.55', label: '55%'},
        { value: '0.6', label: '60%'},
        { value: '0.65', label: '65%'},
        { value: '0.7', label: '70%'},
        { value: '0.75', label: '75%'},
        { value: '0.8', label: '80%'},
        { value: '0.85', label: '85%'},
        { value: '0.9', label: '90%'},
        { value: '0.95', label: '95%'},
        { value: '1', label: '100%'}
      ]
    };
  },
  methods: {
    formatter_create_time(row, column) {
      return util.formatDate.format(
        new Date(row.createTime),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    handleModify(index, row) {
      this.$router.push({ path: "/router01/shop/page3", query: { id: row.id } });
    },
    // //重置密码
    handleReset: function(index, row) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '密码格式不正确',
        inputValue: '123456'
      }).then(({
        value
      }) => {
        let para = {
          password: this.md5(value + row.userId),
          agentId: row.id
        };
        resetAgentPwd(para).then((res) => {
            this.$message({
              message: res.subMsg,
              type: 'success'
            });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消密码重置'
        });
      });
    },
    cilckRate(index, row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.rebateForm.resetFields()
        agentRateConfigView({agentId: row.id}).then(res => {
          this.rebateForm.agentId = res.data.agentId
          let list = res.data.agentRateConfigList
          this.rebateForm.aliRate = list.find(item => item.pay_way === 'ALI') ? list.find(item => item.pay_way === 'ALI').rate : ''
          this.rebateForm.wxRate = list.find(item => item.pay_way === 'WX') ? list.find(item => item.pay_way === 'WX').rate : ''

          this.rebateForm.wxScale = list.find(item => item.pay_way === 'WX') ? list.find(item => item.pay_way === 'WX').reserve1 : ''
          this.rebateForm.aliScale = list.find(item => item.pay_way === 'ALI') ? list.find(item => item.pay_way === 'ALI').reserve1 : ''
        })
      });
    },
    rebateSubmit() {
      let para = util.deepcopy(this.rebateForm)
      para.pageNum = this.page.toString();
      para.aliRate = para.aliRate ? para.aliRate.toString()  : ''
      para.creditRate = para.creditRate ? para.creditRate.toString() : ''
      para.debitRate = para.debitRate ? para.debitRate.toString() : ''
      para.unionpayRate = para.unionpayRate ? para.unionpayRate.toString() : ''
      para.wxRate = para.wxRate ? para.wxRate.toString() : ''
      updateAgentRateConfig(para).then(res => {
        this.dialogVisible = false
        this.$message({
          type: "success",
          message: res.subMsg,
          showClose: true
        });
        this.getUsers()
      })
    },
    getList() {
      this.listLoading = true
      let para = this.filters;
      queryAgentList(para).then(res => {
        this.listLoading = false
        this.users = res.data.userList;
        this.total = res.data.totalCount;
      });
    }
  }
};
</script>
