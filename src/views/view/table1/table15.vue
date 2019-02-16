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
            <el-form-item label="行业名称">
              <el-input v-model="filters.industryName" placeholder="请输入行业名称关键字"></el-input>
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
          <el-table-column prop="industryName" label="行业名称"></el-table-column>
          <el-table-column label="日累计限额" width="300">
            <template slot-scope="{row,$index}">
              <el-input-number class="edit-cell" v-if="showEdit[$index]" :controls="false" v-model="row.dayLimit" :step="1000" :min="1" :max="100000"></el-input-number>
              <!-- <el-input class="edit-cell" v-if="showEdit[$index]" v-model="row.name"></el-input> -->
              <span v-if="!showEdit[$index]">{{row.dayLimit}}</span>
            </template>
          </el-table-column>
          <el-table-column label="单笔交易限额" width="300">
            <template slot-scope="{row,$index}">
              <el-input-number class="edit-cell" v-if="showEdit[$index]" :controls="false" v-model="row.transLimit" :step="1000" :min="1" :max="100000"></el-input-number>
              <!-- <el-input class="edit-cell" v-if="showEdit[$index]" v-model="row.name"></el-input> -->
              <span v-if="!showEdit[$index]">{{row.transLimit}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="160"
            header-align="center">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" @click.native="handleUpdate($index, row)" v-if="showBtn[$index]">确定</el-button>
              <el-button size="mini" @click.native="handleCancel($index, row)" v-if="showBtn[$index]">取消</el-button>
              <el-button type="warning" size="mini" @click.native="handleEdit($index, row)" v-if="!showBtn[$index]">修改</el-button>
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
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  findAllIndustryLimit,
  updateIndustryLimit
} from "@/api/api";
export default {
  data() {
    return {
      filters: {
        industryName: ''
      },
      total: 0,
      page: 1,
      users: [],
      showEdit: [], //显示编辑框
      showBtn: [],
      showBtnOrdinary: true,
      listLoading: false
    };
  },
  methods: {
    //点击编辑
    handleEdit(index, row) {
      this.$set(this.showEdit,index,true)
      this.$set(this.showBtn,index,true)
    },
    //取消编辑
    handleCancel(index, row) {
      this.$set(this.showEdit,index,false)
      this.$set(this.showBtn,index,false)
    },
    //点击更新
    handleUpdate(index, row) {
      let para = {
        industryId: row.industryId,
        dayLimit: row.dayLimit.toString(),
        transLimit: row.transLimit.toString()
      }
      updateIndustryLimit(para).then(res => {
        this.$message({
          message: res.subMsg,
          type: 'success'
        })
        this.$set(this.showEdit,index,false)
        this.$set(this.showBtn,index,false)
        this.getUsers()
      })
    },
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    getUsers () {
      this.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      let para = this.filters;
      para.pageNum = this.page.toString();
      para.rows = 20 
      findAllIndustryLimit(para).then(res => {
        this.listLoading = false
        this.users = res.data.industryLimitList;
        this.total = res.data.total;
      });
    }
  },
  mounted () {
    this.getUsers()
  }
};
</script>
