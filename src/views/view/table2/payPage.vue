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
.bottom_waring{
  font-size:12px;
  color: red;
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
                :loading="shopSearchLoading"
                clearable
                @focus="clickShop" 
@change="selectShopChange">
                <el-option
                  v-for="item in optionsShop"
                  :key="item.id"
                  :value="item.id"
                  :label="item.value"/>
              </el-select>
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
        </el-row>
        <el-row>
          <el-form-item style="float:right">
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
              @click="dialogFormVisible = true">新增支付配置</el-button>
          </el-form-item>
        </el-row>
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
          label="商户名称"
          min-width="165"/>
        <el-table-column
          prop="orderId"
          align="center"
          label="商户标识"
          min-width="285"/>
        <el-table-column
          prop="goodsPrice"
          align="center"
          label="appId"
          width="120"/>
        <el-table-column
          prop="payWay"
          align="center"
          label="类型"
          width="120"/>
        <el-table-column
          prop="status"
          align="center"
          label="微信收银通知模板ID"
          width="150"/>
        <el-table-column
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增支付配置"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      width="580px">
      <p class="bottom_waring">注： * 号为必填项</p>
      <el-form
        :model="addPayForm"
        :rules="addPayFormRules"
        label-position="left"
        label-width="95px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="商户名称"
              prop="name">
              <el-input v-model="addPayForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="商户类型"
              prop="name">
              <el-select
                v-model="addPayForm.region"
                placeholder="请选择活动区域">
                <el-option
                  label="区域一"
                  value="shanghai"/>
                <el-option
                  label="区域二"
                  value="beijing"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="appId"
              prop="name">
              <el-input v-model="addPayForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="appSecret"
              prop="name">
              <el-input v-model="addPayForm.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="appToken">
              <el-input v-model="addPayForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="AESKey"
              prop="name">
              <el-input v-model="addPayForm.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商户号">
              <el-input v-model="addPayForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="微信模板ID"
              prop="name">
              <el-input v-model="addPayForm.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="回调路径">
              <el-input v-model="addPayForm.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所属代理"
              prop="name">
              <el-select
                v-model="addPayForm.region"
                placeholder="请选择活动区域">
                <el-option
                  label="区域一"
                  value="shanghai"/>
                <el-option
                  label="区域二"
                  value="beijing"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible = false">提 交</el-button>
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
        background
        style="text-align:center;background:#fff;padding:15px;"/>
    </el-row>
  </section>
</template>

<script>
import getUsersList from '@/mixins/Users'
import getRemoteSearch from '@/mixins/RemoteSearch'
import { asyncValidatorShopName } from '@/util/async-validator'

export default {
  mixins: [getUsersList, getRemoteSearch],
  data () {
    return {
      filters: {},
      dialogFormVisible: false,
      addPayForm: {},
      addPayFormRules: {
        name: asyncValidatorShopName
      }
    }
  },
  methods: {
    getList () {

    }
  }
}

</script>
