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
      label-width="80px">
      <div class="search_top">
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="商户名称"
              prop="mname">
              <el-input
                v-model="filters.mname"
                placeholder="请输入关键字查询"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="商户账号"
              prop="maccount">
              <el-input
                v-model="filters.maccount"
                placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="商户类型"
              prop="mtype">
              <el-select
                v-model="filters.mtype"
                clearable
                placeholder="请选择">
                <el-option
                  v-for="item in mtypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
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
              <router-link
                to="table3"
                tag="el-button"
                class="is-round el-button--success">
                <i class="el-icon-circle-plus"/> 新增商户
              </router-link>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table
        :data="users"
        border
        stripe
        highlight-current-row>
        <el-table-column
          prop="mid"
          align="center"
          label="商户ID"/>
        <el-table-column
          prop="mname"
          align="center"
          label="商户全称"/>
        <el-table-column
          prop="maccount"
          align="center"
          label="商户账号"/>
        <el-table-column
          prop="mtype"
          align="center"
          label="商户类型"/>
        <el-table-column
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="changMoreCommand">
              <el-button
                type="primary"
                size="mini">
                更多菜单
                <i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">生成二维码</el-dropdown-item>
                <el-dropdown-item command="b">查看门店</el-dropdown-item>
                <el-dropdown-item command="c">查看款台</el-dropdown-item>
                <el-dropdown-item command="d">重置密码</el-dropdown-item>
                <el-dropdown-item command="e">分配代理商</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { queryMerchant } from '@/api/api'
import getUsersList from '@/mixins/Users'
import getRemoteSearch from '@/mixins/RemoteSearch'

export default {
  mixins: [getUsersList, getRemoteSearch],
  data () {
    return {
      filters: {},
      mtypeOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        }
      ]
    }
  },
  methods: {
    changMoreCommand (change) {
      if (change === 'd') {
        this.resetPassword()
      }
    },
    resetPassword () {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的邮箱是: ' + value
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    getList () {
      let para = this.filters
      para.pageNum = this.page.toString()
      queryMerchant(para).then(res => {
        this.users = res.data.merchantsList
        this.total = res.data.totalCount
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {}
}
</script>
