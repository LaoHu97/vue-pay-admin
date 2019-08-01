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
<template>
  <section>
    <el-form
      :inline="true"
      :model="filters"
      label-position="left"
      ref="filters"
      label-width="120px"
    >
      <div class="search_top">
        <el-row>
          <el-col :span="6">
            <el-form-item label="小程序appid" prop="appid">
              <el-input v-model="filters.appid" placeholder="请输入小程序appid查询" />
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
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="nick_name" align="center" label="小程序名称" />
        <el-table-column prop="appid" align="center" label="APPID" />
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="uploadCode(scope.$index, scope.row)">上传代码</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="miniAdminClick(scope.$index, scope.row)"
            >管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="上传代码" :visible.sync="uploadCodeDialogFormVisible" @close="dialogClose('uploadCodeForm')" width="420px">
      <el-form
        :model="uploadCodeForm"
        :rules="uploadCodeFormRules"
        ref="uploadCodeForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="模板ID" prop="template_id">
          <el-input v-model="uploadCodeForm.template_id"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="user_version">
          <el-input v-model="uploadCodeForm.user_version"></el-input>
        </el-form-item>
        <el-form-item label="项目备注">
          <el-input v-model="uploadCodeForm.user_desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadCodeDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiltUploadCode('uploadCodeForm')">确 定</el-button>
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
        style="text-align:center;background:#fff;padding:15px;"
      />
    </el-row>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import { queryMiniProgram, commitMini } from "@/api/api";
import getUsersList from "@/mixins/Users";

export default {
  mixins: [getUsersList],
  data() {
    return {
      filters: {
        appid: ""
      },

      uploadCodeDialogFormVisible: false,
      uploadCodeForm: {
        template_id: '',
        user_version: '',
        user_desc: ''
      },
      uploadCodeFormRules: {
        template_id: [
          { required: true, message: "请输入模板ID", trigger: "blur" }
        ],
        user_version: [
          { required: true, message: "请输入版本号", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    dialogClose(formName){
      this.uploadCodeForm = {
        template_id: '',
        user_version: '',
        user_desc: ''
      }
    },
    submiltUploadCode(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = util.deepcopy(this.uploadCodeForm)
          commitMini(para).then(res => {
            this.uploadCodeDialogFormVisible = false;
            this.$message({
              message: '代码上传成功',
              type: 'success'
            });
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    uploadCode(index, row) {
      this.uploadCodeDialogFormVisible = true;
      this.$nextTick(() => {
        this.uploadCodeForm.mid = row.mid
        this.uploadCodeForm.mini_appid = row.appid
        this.uploadCodeForm.name = row.appname
      })
    },
    miniAdminClick(index, row) {
      this.$router.push({
        path: "/deal/shop/mini2",
        query: { appid: row.appid }
      });
    },
    getList() {
      let para = this.filters;
      para.pageNum = this.page.toString();
      queryMiniProgram(para).then(res => {
        this.users = res.data.miniProgramsList;
        this.total = res.data.totalCount;
      });
    }
  }
};
</script>
