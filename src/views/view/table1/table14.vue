<style scoped>
.search_top {
  background: #f2f2f2;
  margin: 20px 0;
  padding: 20px 10px 0 10px;
}
.top_alert {
  margin-top: 20px;
}
.img_protocol{
  width: 200px;
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
            <el-form-item label="费率类型">
              <el-select v-model="filters.type" clearable placeholder="请选择费率类型">
                <el-option
                  v-for="item in optionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select v-model="filters.status1" clearable placeholder="请选择审核状态">
                <el-option
                  v-for="item in optionsStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
        <el-table-column prop="mname" label="商户名称"/>
        <el-table-column prop="spe_name" label="活动名称"/>
        <el-table-column :formatter="formatCreate_paytype" label="支付方式"/>
        <el-table-column :formatter="formatCreate_reserve1" label="费率类型"/>
        <el-table-column prop="origin_rate" label="原始费率（‰）"/>
        <el-table-column prop="rate" label="变更费率（‰）"/>
        <el-table-column :formatter="formatGmt_modified" label="修改时间"/>
        <el-table-column :formatter="formatCreate_statue" label="状态"/>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" :disabled="scope.row.status1 !== '1'"  @click="auditRate(scope.$index, scope.row)">审核</el-button> -->
            <el-button type="success" size="mini" @click="clickDetailsRate(scope.$index, scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="费率审核" :visible.sync="dialogVisibleRate" width="400px">
      <el-form ref="formRate" :model="formRate" label-width="100px" label-position="left">
        <el-form-item label="费率审核" prop="status1">
          <el-radio v-model="formRate.status1" label="2">驳回</el-radio>
          <el-radio v-model="formRate.status1" label="3">通过</el-radio>
        </el-form-item>
        <el-form-item label="审核意见" prop="operator1_msg">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formRate.operator1_msg">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRate = false">取 消</el-button>
        <el-button type="primary" @click="submiltRate">确 定</el-button>
      </span>
    </el-dialog>
   <el-dialog title="审核详情" :visible.sync="detailsDialogVisible" width="35%">
      <el-form :model="detailsForm" label-width="120px" label-position="left">
        <el-form-item label="支付类型">
          <span>{{formatCreate_paytype(detailsForm)}}</span>
        </el-form-item>
        <el-form-item label="原始费率（‰）">
          <span>{{detailsForm.origin_rate}}</span>
        </el-form-item>
        <el-form-item label="修改费率（‰）">
          <span>{{detailsForm.rate}}</span>
        </el-form-item>
        <el-form-item label="审核状态">
          <span>{{detailsForm.status1 === '1' ? '审核中' : detailsForm.status1 === '2' ? '驳回' : detailsForm.status1 === '3' ? '通过' : '未知'}}</span>
        </el-form-item>
        <!-- <el-form-item label="创建时间">
          <span>{{formatCreate_time(detailsForm)}}</span>
        </el-form-item> -->
        <el-form-item label="修改时间">
          <span>{{formatGmt_modified(detailsForm)}}</span>
        </el-form-item>
        <el-form-item label="附件图片" v-show="detailsForm.img_protocol">
          <img :src="detailsForm.img_protocol" alt="附件图片" class="img_protocol">
        </el-form-item>
        <el-form-item label="附件" v-show="detailsForm.reserve3">
          <a :href="detailsForm.reserve3">下载</a>
        </el-form-item>
      </el-form>
      <el-form ref="formRate" :model="formRate" label-width="100px" label-position="left" v-show="detailsForm.status1 === '1'">
        <el-form-item label="审核意见" prop="operator1_msg" :rules="[{ required: true, message: '请输入审核意见', trigger: 'blur' }]">
          <el-input type="textarea" :rows="2" placeholder="请输入审核意见" v-model="formRate.operator1_msg">
          </el-input>
        </el-form-item>
        <el-form-item label-width="0" style="text-align: center;">
          <el-button type="success" size="p" @click="submiltRate('formRate', '3')">通过</el-button>
          <el-button type="danger" size="p" @click="submiltRate('formRate', '2')">驳回</el-button>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false">关 闭</el-button>
      </span> -->
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
  queryChangeRateList,
  queryMerMname,
  examineChangeRate,
  queryChangeRate
} from "@/api/api";
import { optionsPaymentAll } from "@/util/mockData.js";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        mid: '',
        type: '',
        status1: '1'
      },
      optionsMer: [],
      optionsType: [{
          value: 'Y',
          label: '特殊费率'
        }, {
          value: 'N',
          label: '基础费率'
      }],
      merLoading: false,
      dialogVisibleRate: false,
      formRate: {
        // id: '',
        // mid: '',
        // status1: '2',
        operator1_msg: ''
      },
      detailsDialogVisible: false,
      detailsForm: {},
      optionsStatus: [{
          value: '3',
          label: '通过'
      }, {
          value: '2',
          label: '驳回'
      }, {
          value: '1',
          label: '审核中'
      }]
    };
  },
  methods: {
    formatCreate_reserve1(row, column) {
      return row.reserve1 === 'Y' ? '特殊费率' : '基础费率'
    },
    formatCreate_paytype(row, column) {
      return util.formatPayment(row.payType)
    },
    formatGmt_modified(row, column) {
      return util.formatDate.format(
        new Date(row.gmt_create),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    formatCreate_statue(row, column) {
      return row.status1 === '1' ? '审核中' : row.status1 === '2' ? '驳回' : row.status1 === '3' ? '通过' : '未知'
    },
    clickDetailsRate(index, row) {
      this.detailsDialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRate.resetFields()
        queryChangeRate({id: row.id}).then(res => {
          this.detailsForm = res.data.returnMap
        })
      })
    },
    submiltRate(formName, data) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = util.deepcopy(this.formRate)
            para.status1 = data
            para.mid = this.detailsForm.mid
            para.id = this.detailsForm.id
            examineChangeRate(para).then(res => {
              this.detailsDialogVisible = false
              this.getUsers()
              this.$message({
                message: res.message,
                type: 'success'
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    auditRate(index, row) {
      this.dialogVisibleRate = true
      this.$nextTick(() => {
        this.$refs.formRate.resetFields()
        let c = util.deepcopy(row)
        this.formRate.id = c.id
        this.formRate.mid = c.mid
      })
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
      this.listLoading = true
      let para = this.filters;
      para.pageNum = this.page.toString();
      queryChangeRateList(para).then(res => {
        this.listLoading = false
        this.users = res.data.queryRateList;
        this.total = res.data.totalCount;
      });
    }
  }
};
</script>
