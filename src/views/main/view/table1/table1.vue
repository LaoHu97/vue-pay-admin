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
    <el-row>
      <el-alert title="可查询最近30天的交易" type="warning" class="top_alert" center close-text="知道了" show-icon>
      </el-alert>
    </el-row>
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="98px">
      <div class="search_top">
        <el-row>
          <el-col :span="6">
            <el-form-item label="商户名称" prop="storeName">
              <el-select v-model="filters.storeName" class="fixed_search_input" placeholder="商户名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="storeSearchLoading" clearable @focus="clickShop" @change="selectStoreChange">
                <el-option v-for="item in optionsStore" :key="item.id" :value="item.id" :label="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="门店名称" prop="storeName">
              <el-select v-model="filters.storeName" class="fixed_search_input" placeholder="门店名称" :multiple="false" filterable remote :remote-method="remoteShop" :loading="storeSearchLoading" clearable @focus="clickShop" @change="selectStoreChange">
                <el-option v-for="item in optionsStore" :key="item.id" :value="item.id" :label="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="款台名称" prop="empName">
              <el-select v-model="filters.empName" class="fixed_search_input" placeholder="款台名称" :multiple="false" filterable remote :remote-method="remoteEmp" :loading="empSearchLoading" clearable @focus="clickEmp">
                <el-option v-for="item in optionsEmp" :key="item.eid" :value="item.eid" :label="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付状态" prop="state">
              <el-select v-model="filters.state" class="fixed_search_input" clearable placeholder="支付状态">
                <el-option v-for="item in optionsPayState" :label="item.label" :value="item.value" :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="支付方式" prop="play">
              <el-select v-model="filters.play" class="fixed_search_input" clearable placeholder="支付方式">
                <el-option v-for="item in optionsPayment" :label="item.label" :value="item.value" :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="银行卡类型" prop="cardType">
              <el-select v-model="filters.cardType" class="fixed_search_input" clearable placeholder="银行卡类型">
                <el-option v-for="item in optionsBank" :label="item.label" :value="item.value" :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交易金额" prop="goodsprice">
              <el-input v-model.trim="filters.goodsprice" class="fixed_search_input" placeholder="交易金额">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号" prop="orderId">
              <el-input v-model.trim="filters.orderId" class="fixed_search_input" placeholder="订单号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="第三方订单号" prop="transaction_id">
              <el-input v-model.trim="filters.transaction_id" class="fixed_search_input" placeholder="第三方订单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期时间">
              <el-date-picker v-model="filters.value4" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" v-on:click="getUsers" round icon="el-icon-search">查询</el-button>
              <el-button @click="resetForm('filters')" round>重置</el-button>
              <router-link to="table3" tag="el-button" class="is-round el-button--success">
                <i class="el-icon-circle-plus"></i> 新增商户
              </router-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="payTime" align="center" label="商户号" min-width="165">
        </el-table-column>
        <el-table-column prop="orderId" align="center" label="商户全称" min-width="285">
        </el-table-column>
        <el-table-column prop="goodsPrice" align="center" label="商户账号" width="120" :formatter="format_amount">
        </el-table-column>
        <el-table-column prop="payWay" align="center" label="支付方式" width="120" :formatter="format_payWay">
        </el-table-column>
        <el-table-column prop="status" align="center" label="交易状态" width="150" :formatter="format_status">
        </el-table-column>
        <el-table-column prop="storeName" align="center" label="收款门店" width="120">
        </el-table-column>
        <el-table-column align="center" label="审核状态" width="120">
          <el-switch style="display: block" v-model="value4" active-color="#13ce66" inactive-color="#ff4949" active-text="按月付费" inactive-text="按年付费">
          </el-switch>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button type="primary" size="mini">
                更多菜单
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>生成二维码</el-dropdown-item>
                <el-dropdown-item>查看门店</el-dropdown-item>
                <el-dropdown-item>查看款台</el-dropdown-item>
                <el-dropdown-item>重置密码</el-dropdown-item>
                <el-dropdown-item>分配代理商</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--工具条-->
    <el-row>
      <el-pagination layout="prev, pager, next" :current-page="page" @current-change="handleCurrentChange" :page-size="20" :total="total" background style="text-align:center;background:#fff;padding:15px;">
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
import { optionsPayState, optionsPayment, optionsBank } from '@/util/mockData.js'
import { loginShopVerify } from '@/api/loginApi'
import getUsersList from '@/mixins/Users'
import getRemoteSearch from '@/mixins/RemoteSearch'

export default {
  mixins: [getUsersList, getRemoteSearch],
  data () {
    return {
      filters: {},
      optionsPayState: optionsPayState,
      optionsPayment: optionsPayment,
      optionsBank: optionsBank,
      users: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    format_amount () {

    },
    format_payWay () {

    },
    format_status () {

    },
    getList () {

    }
  },
  mounted () {
    loginShopVerify().then(res => {

    })
  }
}

</script>
