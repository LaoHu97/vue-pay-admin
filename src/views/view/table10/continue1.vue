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
          <el-col :span="8">
            <el-form-item label="证件所属人" prop="cardType">
              <el-select v-model="filters.cardType" placeholder="请选择证件所属人">
                <el-option
                  v-for="item in optionsCardType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型：" prop="type">
              <el-select
                v-model="filters.type"
                placeholder="请输入证件类型关键字查询"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteMerchantType"
                :loading="MerchantTypeLoading"
                clearable
                @focus="clickMerchantType"
              >
                <el-option
                  v-for="item in optionsMerchantType"
                  :key="item.id"
                  :value="item.code"
                  :label="item.type"
                ></el-option>
              </el-select>
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
      <el-table :data="users" border="" stripe highlight-current-row>
        <el-table-column prop="merchant_name" align="center" label="商户名称"/>
        <el-table-column prop="merchant_no" align="center" label="商户号"/>
        <el-table-column prop="cardType" align="center" label="证件所属人" :formatter="expireTimeCardType"/>
        <el-table-column prop="documentTpye" align="center" label="证件类型"/>
        <el-table-column align="center" label="到期日期" :formatter="expireTimeFormatter"/>
        <el-table-column align="center" label="剩余天数（天）">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.surplusDate === 0 ? 'danger' : 'success'"
              disable-transitions>{{surplusDateFormatter(scope.row)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="handleMer(scope.$index, scope.row)"
            >查看商户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="total, prev, pager, next"
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
import { renewalReminderList, bsbLegalDocumentType } from "@/api/api";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        cardType: "person_id_expire",
        type: ''
      },
      MerchantTypeLoading: false,
      optionsMerchantType: [],
      optionsCardType: [{
        value: 'person_id_expire',
        label: '联系人'
      },{
        value: 'merchant_id_expire',
        label: '法人'
      },{
        value: 'contro_id_expire',
        label: '控制人'
      },{
        value: 'settle_id_expire',
        label: '结算人'
      },{
        value: 'licensen_expire',
        label: '营业执照'
      }]
    };
  },
  methods: {
    expireTimeCardType(row, column) {
      return row.cardType === 'person_id_expire' ? '联系人' : row.cardType === 'merchant_id_expire' ? '法人' : row.cardType === 'contro_id_expire' ? '控制人' : row.cardType === 'settle_id_expire' ? '结算人' : row.cardType === 'licensen_expire' ? '营业执照' : 未知
    },
    expireTimeFormatter(row, column) {
      return util.formatDate.format(new Date(row.expireTime), "yyyy/MM/dd hh:MM:ss");
    },
    surplusDateFormatter(row, column) {
      return row.surplusDate === 0 ? '已到期' : row.surplusDate
    },
    handleMer(index, row) {
      this.$router.push({ path: '/router02/shop/table5', query: { mid: row.mid.toString()} })
    },
    clickMerchantType() {
      this.MerchantTypeLoading = true;
      bsbLegalDocumentType({ id: "123" }).then(res => {
        this.MerchantTypeLoading = false;
        this.optionsMerchantType = res.data;
      });
    },
    remoteMerchantType(query) {
      if (query !== "") {
        this.MerchantTypeLoading = true;
        setTimeout(() => {
          this.MerchantTypeLoading = false;
          bsbLegalDocumentType({
            type: query
          }).then(res => {
            this.optionsMerchantType = res.data;
          });
        }, 200);
      } else {
        this.optionsMerchantType = [];
      }
    },
    getList() {
      let para = this.filters;
      para.pageNum = this.page.toString();
      this.listLoading = true;
      renewalReminderList(para).then(res => {
        this.users = res.data.renewalReminderList;
        this.total = res.data.totalCount;
        this.listLoading = false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {}
};
</script>
