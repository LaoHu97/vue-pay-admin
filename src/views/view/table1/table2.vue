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
              <el-button
                type="success"
                round
                icon="el-icon-circle-plus"
                @click="openStoreDialog"
              >新增门店</el-button>
              <el-button type="primary" @click="clickStore">门店数量</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border highlight-current-row>
        <el-table-column prop="storeName" label="门店名称" min-width="120"></el-table-column>
        <el-table-column prop="address" label="门店地址" min-width="180"></el-table-column>
        <el-table-column prop="revsere2" label="联系人" min-width="180"></el-table-column>
        <el-table-column prop="telephone" label="联系电话" min-width="120"></el-table-column>
        <el-table-column prop="saccount" label="登录帐号" width="120"></el-table-column>
        <el-table-column align="center" label="操作" width="480">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editStore(scope.$index, scope.row)">修改</el-button>
            <el-button
              type="success"
              size="mini"
              @click="editOneStore(scope.$index, scope.row)"
            >单门店收款</el-button>
            <el-button type="danger" size="mini" @click="handleReset(scope.$index, scope.row)">密码重置</el-button>
            <el-button type="primary" size="mini" @click="lookEmp(scope.$index, scope.row)">查看款台</el-button>
            <el-button type="info" size="mini" @click="handleDet(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--详情界面-->
    <el-dialog
      title="门店详情"
      :visible.sync="detFormVisible"
      width="450px"
    >
      <el-form :model="detForm" label-width="130px" ref="detForm" label-position="left">
        <el-form-item label="门店名称：">
          <span>{{detForm.storeName}}</span>
        </el-form-item>
        <el-form-item label="客服电话：">
          <span>{{detForm.telephone}}</span>
        </el-form-item>
        <el-form-item label="门店编号：">
          <span>{{detForm.saccount}}</span>
        </el-form-item>
        <el-form-item label="是否单门店收款：">
          <span>{{detForm.isAloneStore ? '是' : '否'}}</span>
        </el-form-item>
        <el-form-item label="单门店配置商户：">
          <span>{{detForm.alonePayMname}}</span>
        </el-form-item>
        <el-form-item label="详细地址：">
          <span>{{detForm.address}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 单门店收款 -->
    <el-dialog title="配置单门店收款" :visible.sync="oneStoreDialogVisible" width="350px">
      <el-form :model="oneStoreForm">
        <el-form-item label="选择商户">
          <el-select
            v-model="oneStoreForm.mid"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oneStoreDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="oneStoreSubmilt">确 定</el-button>
      </span>
    </el-dialog>
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
            <el-form-item label="门店名称" prop="storeName">
              <el-input v-model="addStoreForm.storeName" placeholder="请输入门店名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客服电话" prop="telephone">
              <el-input v-model="addStoreForm.telephone" placeholder="请输入门店客服电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="addStoreForm.linkman" placeholder="请输入门联系人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="详细地址" prop="address">
              <el-input type="textarea" v-model="addStoreForm.address" placeholder="请输入门店详细地址"></el-input>
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
import {
  queryStoresShop,
  addAdminStore,
  updateAdminStore,
  resetStorePwd,
  queryMerMname,
  storePayConfig,
  queryStoreDetail,
  updateChangeCount,
  queryChangeCount
} from "@/api/api";
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
        storeName: "",
        telephone: "",
        address: "",
        linkman: ""
      },
      addStoreFormRules: async.addStoreFormRules,
      dialogType: false,
      oneStoreDialogVisible: false,
      oneStoreForm: {
        mid: "",
        sid: ""
      },
      optionsMer: [],
      merLoading: false,
      detForm: {},
      detFormVisible: false
    };
  },
  methods: {
    lookEmp(index, row) {
      this.$router.push({
        path: "/deal/shop/table4",
        query: { sid: row.id, mid: this.$route.query.mid }
      });
    },
    clickStore() {
      let para = {
        mid: this.$route.query.mid,
        level: '1'
      }
      queryChangeCount(para).then(res => {
        this.$prompt('请输入门店数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]+$/,
          inputErrorMessage: '数量格式不正确',
          inputValue: res.data.counts
        }).then(({ value }) => {
          let para = {
            mid: this.$route.query.mid,
            level: '1',
            counts: value
          }
          updateChangeCount(para).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            });  
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });  
        });
      })
    },
    handleDet(index, row) {
      this.detFormVisible = true
      queryStoreDetail({sid: row.id.toString()}).then(res => {
        this.detForm = res.store
        this.detForm.alonePayMname = res.alonePayMname
        this.detForm.isAloneStore = res.isAloneStore
      })
    },
    oneStoreSubmilt() {
      if (!this.oneStoreForm.mid) {
        return this.$message({
          message: "请选择商户后再试",
          center: true,
          type: "warning"
        });
      }
      let para = util.deepcopy(this.oneStoreForm);
      para.mid = para.mid.toString();
      storePayConfig(para).then(res => {
        this.oneStoreDialogVisible = false;
        this.$message({
          message: res.message,
          type: "success"
        });
      });
    },
    editOneStore(index, row) {
      this.oneStoreDialogVisible = true;
      this.$nextTick(() => {
        this.oneStoreForm.sid = row.id.toString();
        this.oneStoreForm.mid = "";
      });
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
    handleReset(index, row) {
      this.$prompt("请输入密码", "密码重置", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "密码格式不正确",
        inputValue: "123456"
      })
        .then(({ value }) => {
          let para = {
            sid: row.id,
            password: this.md5(value + row.saccount)
          };
          resetStorePwd(para).then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
          });
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
        this.addStoreForm = {
          mid: this.$route.query.mid,
          storeName: "",
          telephone: "",
          address: ""
        };
        this.$refs.addStoreForm.resetFields();
      });
    },
    editStore(index, row) {
      this.addStoreDialogVisible = true;
      this.dialogType = false;
      let c = util.deepcopy(row);
      c.linkman = c.revsere2
      this.$nextTick(() => {
        this.$refs.addStoreForm.resetFields();
        this.addStoreForm = c;
      });
    },
    addStoreSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return;
        }
        let para = util.deepcopy(this.addStoreForm);
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
