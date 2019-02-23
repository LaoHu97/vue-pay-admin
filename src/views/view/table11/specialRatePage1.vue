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
            <el-form-item>
              <el-button type="primary" @click="specialRateClick" round>新增特殊费率</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border="" stripe highlight-current-row>
        <el-table-column prop="speName" label="特殊费率名称"/>
        <el-table-column prop="payWay" label="支付方式" :formatter="payWayFormatter"/>
        <el-table-column prop="speRate" label="费率（‰）"/>
        <el-table-column align="effectDate" label="生效日期" :formatter="effectDateFormatter"/>
        <el-table-column align="expiryDate" label="失效日期" :formatter="expiryDateFormatter"/>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editRate(scope.$index, scope.row)">修 改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="ifsubmiltText" :visible.sync="dialogFormVisibleSpecialRate" width="450px">
      <el-form :model="formSpecialRate" label-position="left" label-width="120px" :rules="rulesFormSpecialRate" ref="formSpecialRate">
        <el-form-item label="特殊费率名称" prop="specialRateName">
          <el-input v-model="formSpecialRate.specialRateName" :disabled="!ifsubmilt"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payWay">
          <el-select v-model="formSpecialRate.payWay" :disabled="!ifsubmilt" placeholder="请选择支付方式">
            <el-option
              v-for="item in optionsPayWay"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特殊费率" prop="rate">
          <el-input v-model="formSpecialRate.rate"></el-input>
        </el-form-item>
        <el-form-item label="特殊费率规则" prop="commissionRules">
          <el-input v-model="formSpecialRate.commissionRules"></el-input>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectDate">
          <el-date-picker
            v-model="formSpecialRate.effectDate"
            type="date"
             :disabled="!ifsubmilt"
            placeholder="选择日期"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效日期" prop="expiryDate">
          <el-date-picker
            v-model="formSpecialRate.expiryDate"
            type="date"
            placeholder="选择日期"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSpecialRate = false">取 消</el-button>
        <el-button type="primary" v-if="ifsubmilt" @click="submiltSpecialRate('formSpecialRate')">确 定</el-button>
        <el-button type="primary" v-else @click="editSpecialRate('formSpecialRate')">修 改</el-button>
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
        background=""
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import { querySpecialRate, addSpecialRate, updateSpecialRate } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {

      },
      optionsCardType: [],
      dialogFormVisibleSpecialRate: false,
      formSpecialRate: {
        speRateId: '',
        specialRateName: '',
        payWay: '',
        rate: '',
        commissionRules: '',
        effectDate: '',
        expiryDate: ''
      },
      optionsPayWay: [{
        value: 'WX',
        label: '微信'
      }, {
        value: 'ALI',
        label: '支付宝'
      }],
      rulesFormSpecialRate: {
        specialRateName: [
          { required: true, message: '请输入特殊费率名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        payWay: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        rate: [
          { required: true, message: '请输入特殊费率', trigger: 'blur' }
        ],
        commissionRules: [
          { required: true, message: '请输入费率规则', trigger: 'blur' }
        ],
        effectDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        expiryDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      ifsubmilt: true,
      ifsubmiltText: ''
    };
  },
  methods: {
    expiryDateFormatter(row, column) {
      return util.formatDate.format(new Date(row.expiryDate), "yyyy/MM/dd");
    },
    effectDateFormatter(row, column) {
      return util.formatDate.format(new Date(row.effectDate), "yyyy/MM/dd");
    },
    payWayFormatter(row, column) {
      return util.formatPayment(row.payWay)
    },
    getList() {
      let para = this.filters;
      para.pageNum = this.page.toString();
      this.listLoading = true;
      querySpecialRate(para).then(res => {
        this.users = res.data.specialRateList;
        this.total = res.data.totalCount;
        this.listLoading = false;
      });
    },
    editRate(index, row) {
      this.dialogFormVisibleSpecialRate = true
      this.$nextTick(() => {
        this.ifsubmilt = false
        this.ifsubmiltText = '修改特殊费率'
        this.formSpecialRate.speRateId = row.id
        this.formSpecialRate.specialRateName = row.speName
        this.formSpecialRate.payWay = row.payWay
        this.formSpecialRate.effectDate = parseInt(row.effectDate)
        this.formSpecialRate.expiryDate = parseInt(row.expiryDate)
        this.formSpecialRate.rate = row.speRate.toString()
        this.formSpecialRate.commissionRules = row.commissiouRule
      })
    },
    specialRateClick() {
      this.dialogFormVisibleSpecialRate = true
      this.$nextTick(() => {
        this.ifsubmilt = true
        this.ifsubmiltText = '新增特殊费率'
        this.$refs.formSpecialRate.resetFields()
      })
    },
    editSpecialRate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let para = this.formSpecialRate
          if (para.effectDate>para.expiryDate) {
            return  this.$message({
              message: '生效日期不能大于失效日期',
              type: 'warning'
            })
          }
          updateSpecialRate(para).then(res => {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.getUsers()
            this.dialogFormVisibleSpecialRate = false
          })
        } else {
          return false;
        }
      });
    },
    submiltSpecialRate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let para = this.formSpecialRate
          if (para.effectDate>para.expiryDate) {
            return  this.$message({
              message: '生效日期不能大于失效日期',
              type: 'warning'
            })
          }
          addSpecialRate(para).then(res => {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.getUsers()
            this.dialogFormVisibleSpecialRate = false
          })
        } else {
          return false;
        }
      });
    }
  },
  mounted() {}
};
</script>
