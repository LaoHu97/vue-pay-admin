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
    <el-form :inline="true" :model="filters" label-position="left" ref="filters" label-width="98px">
      <div class="search_top">
        <el-row>
          <el-col :span="18">
            <el-form-item label="门店名称" prop="storeName">
              <el-input
                v-model="filters.storeName"
                class="fixed_search_input"
                placeholder="请输入门店名称关键字"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
              <el-button @click="resetForm('filters')" round>重置</el-button>
              <el-button
                type="success"
                round
                icon="el-icon-circle-plus"
                @click="openStoreDialog"
              >新增门店</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border="" highlight-current-row>
        <el-table-column prop="storeName" label="门店名称" min-width="120"></el-table-column>
        <el-table-column prop="address" label="门店地址" min-width="180"></el-table-column>
        <el-table-column prop="telephone" label="联系电话" min-width="120"></el-table-column>
        <el-table-column prop="saccount" label="登录帐号" width="120"></el-table-column>
        <el-table-column prop="status" label="门店状态" width="150"></el-table-column>
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleReset(scope.$index, scope.row)">密码重置</el-button>
            <el-button type="warning" size="mini" @click="editStore(scope.$index, scope.row)">修改</el-button>
            <el-button type="info" size="mini" @click="handleDet(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogType ? '新增门店' : '修改门店'"
      :visible.sync="addStoreDialogVisible"
      width="600px"
      center
    >
      <el-form
        :model="addStoreForm"
        :rules="addStoreFormRules"
        ref="addStoreForm"
        label-position="left"
        label-width="95px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店名" prop="mname">
              <el-input v-model="addStoreForm.mname" placeholder="请输入2-20个字符或数字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分店名" prop="storeName">
              <el-input v-model="addStoreForm.storeName" placeholder="请输入分店名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="addStoreForm.address" placeholder="请输入门店详细地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="人均价格(￥)" prop="avgPrice">
              <el-input-number
                v-model="addStoreForm.avgPrice"
                :precision="2"
                :step="0.01"
                :max="9999"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道门店ID" prop="aliStoreId">
              <el-input v-model="addStoreForm.aliStoreId" placeholder="请输入渠道门店ID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="特色服务" prop="special">
              <el-input v-model="addStoreForm.special" placeholder="请输入门店特色服务"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客服电话" prop="telephone">
              <el-input v-model="addStoreForm.telephone" placeholder="请输入门店客服电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="推荐" prop="recommend">
              <el-input v-model="addStoreForm.recommend" placeholder="请输入推荐信息"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="营业时间" prop="shopHours">
              <el-time-picker
                is-range
                v-model="addStoreForm.shopHours"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm:ss"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="门店简介" prop="introduction">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入门店简介内容"
                v-model="addStoreForm.introduction"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStoreDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogType" @click="addStoreSubmit('addStoreForm')">提 交</el-button>
        <el-button type="primary" v-else @click="editStoreSubmit('addStoreForm')">修 改</el-button>
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
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row>
  </section>
</template>

<script>
import { queryStoresShop, addAdminStore, updateAdminStore, resetStorePwd } from "@/api/api";
import * as util from "@/util/util.js";
import * as async from "@/util/async-validator/addStoreFormRules";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";

export default {
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      filters: {
        storeName: ""
      },
      addStoreDialogVisible: false,
      addStoreForm: {
        mid: this.$route.query.mid,
        mname: "",
        storeName: "",
        telephone: "",
        avgPrice: "",
        shopHours: "",
        recommend: "",
        special: "",
        introduction: "",
        address: "",
        aliStoreId: ""
      },
      addStoreFormRules: async.addStoreFormRules,
      dialogType: false
    };
  },
  methods: {
    handleReset(index, row) {
      this.$prompt("请输入密码", "密码重置", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "密码格式不正确",
        inputValue: '123456'
      })
        .then(({ value }) => {
          let para = {
            sid: row.id,
            password: this.md5(value + row.saccount)
          }
          resetStorePwd(para).then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    getList() {
      let para = {
        mid: this.$route.query.mid,
        pageNum: this.page,
        storeName: this.filters.storeName
      };
      this.listLoading = true;
      queryStoresShop(para).then(res => {
        this.total = res.data.totalCount;
        this.users = res.data.storeList;
        this.listLoading = false;
      });
    },
    openStoreDialog() {
      this.addStoreDialogVisible = true;
      this.dialogType = true;
      this.$nextTick(() => {
        this.$refs.addStoreForm.resetFields();
        console.log(this.addStoreForm);
      });
    },
    editStore(index, row) {
      this.addStoreDialogVisible = true;
      this.dialogType = false;
      let c = util.deepcopy(row);
      c.shopHours = c.shopHours.split("-");
      this.$nextTick(() => {
        this.addStoreForm = c;
      });
    },
    addStoreSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        let para = util.deepcopy(this.addStoreForm);
        para.avgPrice = para.avgPrice.toString();
        para.shopHours = `${para.shopHours[0]}-${para.shopHours[1]}`;
        addAdminStore(para).then(res => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getUsers();
          }
          this.addStoreDialogVisible = false;
        });
      });
    },
    editStoreSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        let para = util.deepcopy(this.addStoreForm);
        para.avgPrice = para.avgPrice.toString();
        para.shopHours = `${para.shopHours[0]}-${para.shopHours[1]}`;
        updateAdminStore(para).then(res => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getUsers();
          }
          this.addStoreDialogVisible = false;
        });
      });
    }
  }
};
</script>
