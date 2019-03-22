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
          <el-col :span="18">
            <el-form-item label="公告标题">
              <el-input v-model="filters.noticeTitle" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getUsers" round icon="el-icon-search">查询</el-button>
              <el-button type="success" @click="addNotice" round>添加公告</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-dialog :title="formNoticeTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="formNotice" :rules="rulesFormNotice" ref="formNotice" label-position="top" label-width="80px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="formNotice.title"></el-input>
        </el-form-item>
        <el-form-item label="公告作者" prop="writer">
          <el-input v-model="formNotice.writer"></el-input>
        </el-form-item>
        <el-form-item label="公告状态">
          <el-switch
            v-model="formNotice.status"
            active-value="Y"
            inactive-value="N"
            active-text="开启"
            inactive-text="关闭">
          </el-switch>
        </el-form-item>
        <el-form-item label="公告内容" prop="article">
        <!-- 图片上传组件辅助-->
          <el-upload
            class="avatar-uploader"
            :action="serverUrl"
            name="filedata"
            :headers="header"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload">
          </el-upload>
          <!--富文本编辑器组件-->
          <el-row v-loading="quillUpdateImg">
            <quill-editor
              v-model="formNotice.article"
              ref="myQuillEditor"
              :options="editorOption"
              @change="onEditorChange($event)"
              @ready="onEditorReady($event)">
            </quill-editor>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiltNotice('formNotice')">确 定</el-button>
      </div>
    </el-dialog>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table :data="users" border stripe highlight-current-row>
        <el-table-column prop="title" label="公告标题"/>
        <el-table-column :formatter="formatter_status" label="公告状态" align="center"/>
        <el-table-column :formatter="formatter_create_time" label="创建时间"/>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editNotice(scope.$index, scope.row)">修 改</el-button>
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

import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import {
  queryNotice,
  addNotice,
  queryNoticeDetail,
  upNoticeImage
} from "@/api/api";
import { optionsPaymentAll } from "@/util/mockData.js";
import getUsersList from "@/mixins/Users";
import getRemoteSearch from "@/mixins/RemoteSearch";
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction

  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': []}],
  [{'align': []}],
  ['link', 'image', 'video'],
  ['clean']                                         // remove formatting button
]
export default {
  components: {
    quillEditor
  },
  mixins: [getUsersList, getRemoteSearch],
  data() {
    return {
      editorOption: {
 
      },
      formNoticeTitle: '添加公告',
      filters: {
        noticeTitle: ''
      },
      formNotice: {
        id: '',
        title: '',
        writer: '',
        article: '',
        status: 'N'   
      },
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      serverUrl: upNoticeImage,  // 这里写你要上传的图片服务器地址
      header: {token: sessionStorage.token},  // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      editorOption: {
        placeholder: '',
        theme: 'snow',  // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
            }
          }
        }
      },
      dialogFormVisible: false,
      rulesFormNotice: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ],
        writer: [
          { required: true, message: '请输入公告作者', trigger: 'blur' }
        ],
        article: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ]
      }
    };
  },

  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted() {
    let content = '';  // 请求后台返回的内容字符串
    this.str = this.escapeStringHTML(content);
  },
  methods: {
    // 上传图片前
    beforeUpload(res, file) {
      // 显示loading动画
      this.quillUpdateImg = true
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code === '000000' && res.subCode === '000000') {
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.info为服务器返回的图片地址
          quill.insertEmbed(length, 'image', res.data.imageUrl)
          // 调整光标到最后
          quill.setSelection(length + 1)
      } else {
          this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 上传图片失败
    uploadError(res, file) {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },

    onEditorReady(editor) {}, // 准备编辑器
    onEditorBlur(){}, // 失去焦点事件
    onEditorFocus(){}, // 获得焦点事件
    onEditorChange(){}, // 内容改变事件
    // 转码
    escapeStringHTML(str) {
        str = str.replace(/&lt;/g,'<');
        str = str.replace(/&gt;/g,'>');
        return str;
    },
    formatter_create_time(row, column) {
      return util.formatDate.format(
        new Date(row.gmt_create),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    formatter_status(row, column) {
      return row.status === 'Y' ? '开启' : row.status === 'N' ? '关闭' : '未知'
    },
    submiltNotice(formName) {
      let para = this.formNotice
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addNotice(para).then(res => {
            this.dialogFormVisible = false
            this.$message({
              type: "success",
              message: res.subMsg,
              showClose: true
            });
            this.getUsers()
          })
        }
      })
    },
    editNotice(index, row) {
      this.dialogFormVisible = true
      this.formNoticeTitle = '修改公告'
      this.$nextTick(() => {
        queryNoticeDetail({id: row.id}).then(res => {
          this.formNotice.id = res.data.sysNotice.id.toString()
          this.formNotice.title = res.data.sysNotice.title
          this.formNotice.writer = res.data.sysNotice.writer
          this.formNotice.article = res.data.sysNotice.article
          this.formNotice.status = res.data.sysNotice.status
        })
      })      
    },
    addNotice() {
      this.dialogFormVisible = true
      this.formNoticeTitle = '添加公告'
      this.$nextTick(() => {
        this.formNotice.status = 'N'
        this.$refs.formNotice.resetFields()
      })
    },
    getList() {
      this.listLoading = true
      let para = this.filters;
      para.pageNum = this.page.toString();
      queryNotice(para).then(res => {
        this.listLoading = false
        this.users = res.data.noticeList;
        this.total = res.data.totalCount;
      });
    }
  }
};
</script>
