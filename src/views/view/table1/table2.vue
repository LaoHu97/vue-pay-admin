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
      <el-alert
        title="可查询最近30天的交易"
        type="warning"
        class="top_alert"
        center
        close-text="知道了"
        show-icon/>
    </el-row>
    <el-form
      :inline="true"
      :model="filters"
      label-position="left"
      ref="filters"
      label-width="98px">
      <div class="search_top">
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="商户名称"
              prop="storeName">
              <el-select
                v-model="filters.storeName"
                class="fixed_search_input"
                placeholder="商户名称"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteShop"
                :loading="storeSearchLoading"
                clearable
                @focus="clickShop" 
@change="selectStoreChange">
                <el-option
                  v-for="item in optionsStore"
                  :key="item.id"
                  :value="item.id"
                  :label="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="门店名称"
              prop="storeName">
              <el-select
                v-model="filters.storeName"
                class="fixed_search_input"
                placeholder="门店名称"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteShop"
                :loading="storeSearchLoading"
                clearable
                @focus="clickShop" 
@change="selectStoreChange">
                <el-option
                  v-for="item in optionsStore"
                  :key="item.id"
                  :value="item.id"
                  :label="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="款台名称"
              prop="empName">
              <el-select
                v-model="filters.empName"
                class="fixed_search_input"
                placeholder="款台名称"
                :multiple="false"
                filterable
                remote
                :remote-method="remoteEmp"
                :loading="empSearchLoading"
                clearable
                @focus="clickEmp">
                <el-option
                  v-for="item in optionsEmp"
                  :key="item.eid"
                  :value="item.eid"
                  :label="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="支付状态"
              prop="state">
              <el-select
                v-model="filters.state"
                class="fixed_search_input"
                clearable
                placeholder="支付状态">
                <el-option
                  v-for="item in optionsPayState"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="支付方式"
              prop="play">
              <el-select
                v-model="filters.play"
                class="fixed_search_input"
                clearable
                placeholder="支付方式">
                <el-option
                  v-for="item in optionsPayment"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="银行卡类型"
              prop="cardType">
              <el-select
                v-model="filters.cardType"
                class="fixed_search_input"
                clearable
                placeholder="银行卡类型">
                <el-option
                  v-for="item in optionsBank"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="交易金额"
              prop="goodsprice">
              <el-input
                v-model.trim="filters.goodsprice"
                class="fixed_search_input"
                placeholder="交易金额"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="订单号"
              prop="orderId">
              <el-input
                v-model.trim="filters.orderId"
                class="fixed_search_input"
                placeholder="订单号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="第三方订单号"
              prop="transaction_id">
              <el-input
                v-model.trim="filters.transaction_id"
                class="fixed_search_input"
                placeholder="第三方订单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期时间">
              <el-date-picker
                v-model="filters.value4"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button
                type="primary"
                @click="getUsers"
                round
                icon="el-icon-search">查询</el-button>
              <el-button
                @click="resetForm('filters')"
                round>重置</el-button>
              <el-button
                type="success"
                round
                icon="el-icon-circle-plus"
                @click="addStoreDialogVisible = true">新增门店</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row/>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table
        :data="users"
        border
        highlight-current-row>
        <el-table-column
          prop="payTime"
          align="center"
          label="付款时间"
          min-width="165"/>
        <el-table-column
          prop="orderId"
          align="center"
          label="订单号"
          min-width="285"/>
        <el-table-column
          prop="goodsPrice"
          align="center"
          label="交易金额"
          width="120"
          :formatter="format_amount"/>
        <el-table-column
          prop="payWay"
          align="center"
          label="支付方式"
          width="120"
          :formatter="format_payWay"/>
        <el-table-column
          prop="status"
          align="center"
          label="交易状态"
          width="150"
          :formatter="format_status"/>
        <el-table-column
          prop="storeName"
          align="center"
          label="收款门店"
          width="120"/>
        <el-table-column
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="handleDetail(scope.$index, scope.row)">订单详情</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleRefund(scope.$index, scope.row)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增门店"
      :visible.sync="addStoreDialogVisible"
      width="580px"
      center>
      <el-form
        :model="addStoreForm"
        label-position="left"
        label-width="95px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店名">
              <el-input
                v-model="addStoreForm.storeName"
                placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分店名">
              <el-input
                v-model="addStoreForm.branchStoreName"
                placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="详细地址">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店图片">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道门店ID">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="人均价格">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业时间">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="推荐(选填)">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="特色服务">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="简介(选填)">
              <el-input placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="addStoreDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addStoreDialogVisible = false">提 交</el-button>
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
        style="text-align:center;background:#fff;padding:15px;"/>
    </el-row>
  </section>
</template>

<script>
import { optionsPayState, optionsPayment, optionsBank } from '@/util/mockData.js'
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
      addStoreDialogVisible: false,
      addStoreForm: {}
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
  }
}

</script>
