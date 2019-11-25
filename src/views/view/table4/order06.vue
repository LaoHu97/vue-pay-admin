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
          <el-col :span="10">
            <el-form-item label="结算日期" prop="settleDate">
              <el-date-picker
                v-model="filters.settleDate"
                type="date"
                placeholder="开始日期"
                value-format="timestamp"
                :clearable = false
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称" prop="mName">
                <el-select
                    v-model="filters.mName"
                    placeholder="请输入商户名称关键字查询"
                    :multiple="false"
                    filterable
                    remote
                    :remote-method="remoteMerchants"
                    :loading="merchantsLoading"
                    clearable
                    @focus="clickMerchants"
                >
                    <el-option
                    v-for="item in optionsMerchants"
                    :key="item"
                    :value="item"
                    :label="item"
                    ></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">刷新统计</el-button>
              <el-button @click="resetForm('filters')" round>重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import { merchantsDayStatistics, queryMerchantsInfo } from "@/api/api";

export default {
  data() {
    return {
      filters: {
        settleDate: new Date((new Date).getFullYear(), (new Date).getMonth(), (new Date).getDate() -1 ).getTime(),
        mName: ""
      },

      optionsMerchants: [],
      merchantsLoading: false
    };
  },
  methods: {
    clickMerchants() {
      this.merchantsLoading = true;
      queryMerchantsInfo({ mName: '' }).then(res => {
        this.merchantsLoading = false;
        this.optionsMerchants = res.data;
      });
    },
    remoteMerchants(query) {
      if (query !== "") {
        this.merchantsLoading = true;
        setTimeout(() => {
          this.merchantsLoading = false;
          queryMerchantsInfo({
            mName: query
          }).then(res => {
            this.optionsMerchants = res.data;
          });
        }, 200);
      } else {
        this.optionsMerchants = [];
      }
    },
    getUsers() {
      let para = this.filters;
      para.settleDate = para.settleDate.toString()
      merchantsDayStatistics(para).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {}
};
</script>
