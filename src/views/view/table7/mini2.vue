<style scoped>
.box-card {
  margin-top: 20px;
}
.icon {
  margin: 0 5px;
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.3em;
  fill: currentColor;
  overflow: hidden;
}
.box-card-pay-icon {
  margin: 0 5px;
  width: 3.5em;
  height: 3.5em;
  vertical-align: -1.4em;
  fill: currentColor;
  overflow: hidden;
}
.box_card_img {
  width: 100px;
  height: 120px;
  border: 1px solid #999;
  padding: 4px;
  border-radius: 4px;
}
.grid_content_id {
  font-size: 16px;
  color: #999;
}
.grid_content_val {
  font-size: 24px;
  font-weight: bolder;
}
.grid_content_center {
  font-size: 16px;
  color: #333;
}
.grid_content_center span {
  color: #999;
  width: 80px;
  display: inline-block;
}
.grid_content {
  height: 60px;
}
.grid_content3 {
  margin-top: 20px;
}
.grid_content4 {
  margin-top: 40px;
  text-align: center;
}
.box-card-pay-none {
  text-align: center;
  margin: 20px 0;
  color: #999;
}
.from_bottom_text {
  font-size: 14px;
  color: #999;
  margin: 0;
  margin-top: 5px;
}
</style>
<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-_mendian" />
        </svg>
        <span>服务器域名</span>
      </div>
      <div class="box-card-pay" v-loading="domainLoading">
        <el-table :data="tableData" border :span-method="objectSpanMethod" style="width: 100%">
          <el-table-column label="服务器配置">
            <template slot-scope="scope">
              {{scope.row.name}}：
              <span
                v-for="(item, index) in scope.row.url"
                v-bind:key="index"
              >{{item}}；</span>
            </template>
          </el-table-column>
          <el-table-column label="说明">
            <template>域名需要在第三方平台设置</template>
          </el-table-column>
          <el-table-column prop="address" align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="editorDomainClick(scope.$index, scope.row)"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-_mendian" />
        </svg>
        <span>体验成员</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="personnelClick">绑定成员</el-button>
      </div>
      <div class="box-card-pay"></div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-_mendian" />
        </svg>
        <span>线上版本</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="queryAudit">查询审核</el-button>
      </div>
      <div class="box-card-pay" v-if="onlineCode">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid_content1">
              <p class="grid_content_id">模板ID</p>
              <p class="grid_content_val">{{onlineCode.reserve1}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid_content2">
              <p class="grid_content_id">版本号</p>
              <p class="grid_content_val">{{onlineCode.version}}</p>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid_content3">
              <p class="grid_content_center">
                <span>提交时间：</span>
                {{FormatTime(onlineCode.gmt_create)}}
              </p>
              <p class="grid_content_center">
                <span>描述：</span>
                {{onlineCode.instruction}}
              </p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid_content4">
              <el-button
                type="danger"
                size="medium"
                @click="onlineCodeClick(onlineCode.status)"
                :disabled="onlineCode.status === 2 || onlineCode.status === 3"
              >{{onlineCode.status === 1 ? '发布' : onlineCode.status === 2 ? '审核失败' : onlineCode.status === 3 ? '审核中' : onlineCode.status === 4 ? '已撤销' : onlineCode.status === 5 ? '暂停服务' : onlineCode.status === 6 ? '开始服务' : '未知'}}</el-button>
              <el-button
                type="text"
                @click="onlineCodeUn(onlineCode.status)"
                v-if="onlineCode.status === 3"
              >撤回</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="box-card-pay-none" v-else>您还没有上传代码</div>
    </el-card>
    <el-card class="box-card">
      <div slot="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-_mendian" />
        </svg>
        <span>开发版本</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="qrCodeClick">体验二维码</el-button>
      </div>
      <div class="box-card-pay" v-if="updateCode">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid_content1">
              <p class="grid_content_id">模板ID</p>
              <p class="grid_content_val">{{updateCode.template_id}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid_content2">
              <p class="grid_content_id">版本号</p>
              <p class="grid_content_val">{{updateCode.version}}</p>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid_content3">
              <p class="grid_content_center">
                <span>提交时间：</span>
                {{FormatTime(updateCode.commit_time)}}
              </p>
              <p class="grid_content_center">
                <span>描述：</span>
                {{updateCode.reserve2}}
              </p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid_content4">
              <el-button
                type="primary"
                size="medium"
                :disabled="updateCode.status === 3"
                @click="showAuditDialog"
              >提交审核</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="box-card-pay-none" v-else>您还没有上传代码</div>
    </el-card>
    <el-dialog title="提交审核" :visible.sync="auditDialogFormVisible" width="620px">
      <el-form :model="auditForm" label-position="left" label-width="120px" size="medium">
        <div v-for="(item, index) in auditForm.item_list" v-bind:key="index">
          <h3>
            <span>功能页面{{index + 1}}</span>
            <el-button type="text" style="float: right" @click="removePages" v-show="index !== 0">删除</el-button>
          </h3>
          <el-form-item label="功能页面">
            <el-select v-model="item.address" placeholder="请选择">
              <el-option v-for="(item, index) in addressOptions" :key="index" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="item.title"></el-input>
          </el-form-item>
          <el-form-item label="所在服务类目">
            <el-select
              v-model="item.first_id"
              placeholder="请选择"
              style="width: 120px; margin-left: 5px"
            >
              <el-option
                v-for="item in cascaderOptions"
                :key="item.first_id"
                :label="item.first_class"
                :value="item.first_id"
              ></el-option>
            </el-select>
            <el-select
              v-model="item.second_id"
              placeholder="请选择"
              style="width: 120px; margin-left: 5px"
            >
              <el-option
                v-for="item in cascaderOptions"
                :key="item.second_id"
                :label="item.second_class"
                :value="item.second_id"
              ></el-option>
            </el-select>
            <el-select
              v-model="item.third_id"
              placeholder="请选择"
              style="width: 120px; margin-left: 5px"
            >
              <el-option
                v-for="item in cascaderOptions"
                :key="item.third_id"
                :label="item.third_class"
                :value="item.third_id"
              ></el-option>
            </el-select>
            <p class="from_bottom_text">功能页面和服务类目必须一一对应</p>
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="item.tag"></el-input>
            <p class="from_bottom_text">标签用一个空格分开，填写与页面功能相关的标签，更容易被搜索</p>
          </el-form-item>
          <el-divider></el-divider>
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="addPages"
            v-show="index !== 4"
          >添加功能页面</el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sunbmiltAudit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="服务器域名"
      :visible.sync="domainDialogFormVisible"
      width="620px"
      @close="dialogClose('domainForm')"
    >
      <el-form
        :model="domainForm"
        ref="domainForm"
        label-position="left"
        label-width="160px"
        size="medium"
      >
        <el-form-item label="request合法域名">
          <el-input
            v-model="item.value"
            style="margin-bottom: 8px"
            v-for="(item, index) in domainForm.requestUrl"
            v-bind:key="index"
          >
            <template slot="prepend">https://</template>
            <el-button
              slot="append"
              v-if="index === 0"
              icon="el-icon-circle-plus"
              @click="addRequestDomain('requestUrl')"
            ></el-button>
            <el-button
              slot="append"
              v-else
              icon="el-icon-remove"
              @click="removeRequestDomain('requestUrl')"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="socket合法域名">
          <el-input
            v-model="item.value"
            style="margin-bottom: 8px"
            v-for="(item, index) in domainForm.wsrequestUrl"
            v-bind:key="index"
          >
            <template slot="prepend">https://</template>
            <el-button
              slot="append"
              v-if="index === 0"
              icon="el-icon-circle-plus"
              @click="addRequestDomain('wsrequestUrl')"
            ></el-button>
            <el-button
              slot="append"
              v-else
              icon="el-icon-remove"
              @click="removeRequestDomain('wsrequestUrl')"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="uploadFile合法域名">
          <el-input
            v-model="item.value"
            style="margin-bottom: 8px"
            v-for="(item, index) in domainForm.uploadUrl"
            v-bind:key="index"
          >
            <template slot="prepend">https://</template>
            <el-button
              slot="append"
              v-if="index === 0"
              icon="el-icon-circle-plus"
              @click="addRequestDomain('uploadUrl')"
            ></el-button>
            <el-button
              slot="append"
              v-else
              icon="el-icon-remove"
              @click="removeRequestDomain('uploadUrl')"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="downloadFile合法域名">
          <el-input
            v-model="item.value"
            style="margin-bottom: 8px"
            v-for="(item, index) in domainForm.downloadUrl"
            v-bind:key="index"
          >
            <template slot="prepend">https://</template>
            <el-button
              slot="append"
              v-if="index === 0"
              icon="el-icon-circle-plus"
              @click="addRequestDomain('downloadUrl')"
            ></el-button>
            <el-button
              slot="append"
              v-else
              icon="el-icon-remove"
              @click="removeRequestDomain('downloadUrl')"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="domainDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiltDomain">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  addModifyDomain,
  getModifyDomain,
  bindTester,
  queryCommitMini,
  getQrcode,
  getCategory,
  getPage,
  submitAudit,
  getMiniDetail,
  getAuditStatus,
  release,
  undocodeaudit,
  changeVisitStatus
} from "@/api/api";

export default {
  data() {
    return {
      domainLoading: false,
      tableData: [],

      domainDialogFormVisible: false,
      domainForm: {
        requestUrl: [{ value: "" }],
        wsrequestUrl: [{ value: "" }],
        uploadUrl: [{ value: "" }],
        downloadUrl: [{ value: "" }]
      },

      updateCode: {},

      auditDialogFormVisible: false,
      auditForm: {
        item_list: [
          {
            address: "",
            tag: "",
            title: "",
            first_id: "",
            second_id: "",
            third_id: ""
          }
        ]
      },
      addressOptions: [],
      cascaderOptions: [],

      onlineCode: {}
    };
  },
  mounted() {
    this.getDomainList();
    this.getUpdateCodeList();
    this.getOnlineCode();
  },
  methods: {
    onlineCodeUn() {
      let para = {
        appid: this.$route.query.appid,
        detailId: this.onlineCode.id
      };
      undocodeaudit(para).then(res => {
        this.getOnlineCode();
      });
    },
    onlineCodeClick(status) {
      let para = {
        appid: this.$route.query.appid,
        detailId: this.onlineCode.id
      };
      if (status === 1 || status === 6) {
        release(para).then(res => {
          this.getOnlineCode();
        });
      } else if (status === 5) {
        para.action= 'close'
        changeVisitStatus(para).then(res => {
          this.getOnlineCode();
        });
      }
    },
    queryAudit() {
      let para = {
        appid: this.$route.query.appid,
        detailId: this.onlineCode.id
      };
      getAuditStatus(para).then(res => {
        this.getOnlineCode();
      });
    },
    getOnlineCode() {
      getMiniDetail({ appid: this.$route.query.appid }).then(res => {
        this.onlineCode = res.data.detailList;
      });
    },
    sunbmiltAudit() {
      let para = util.deepcopy(this.auditForm);
      para.appid = this.$route.query.appid;
      para.item_list.map(data => {
        if (data.first_id) {
          data.first_class = this.cascaderOptions.find(val => {
            if (data.first_id === val.first_id) {
              return val;
            }
          }).first_class;
        }
        if (data.second_id) {
          data.second_class = this.cascaderOptions.find(val => {
            if (data.second_id === val.second_id) {
              return val;
            }
          }).second_class;
        }
        if (data.third_id) {
          data.third_class = this.cascaderOptions.find(val => {
            if (data.third_id === val.third_id) {
              return val;
            }
          }).third_class;
        }
      });
      submitAudit(para).then(res => {
        this.auditDialogFormVisible = false;
        this.getUpdateCodeList();
      });
    },
    removePages() {
      this.auditForm.item_list.splice(this.auditForm.item_list.indexOf(), 1);
    },
    addPages() {
      this.auditForm.item_list.push({
        address: "",
        tag: "",
        title: "",
        first_id: "",
        second_id: "",
        third_id: ""
      });
    },
    getMiniPages() {
      getPage({ appid: this.$route.query.appid }).then(res => {
        this.addressOptions = res.data.pageList;
      });
    },
    getCascaderOptions() {
      getCategory({ appid: this.$route.query.appid }).then(res => {
        this.cascaderOptions = res.data.categoryList;
      });
    },
    showAuditDialog() {
      this.auditDialogFormVisible = true;
      this.getCascaderOptions();
      this.getMiniPages();
    },
    FormatTime(date) {
      return util.formatDate.format(new Date(date), "yyyy/MM/dd hh:MM:ss");
    },
    qrCodeClick() {
      getQrcode({ appid: this.$route.query.appid }).then(res => {
        let url = res.data.getQrCodeUrl;
        this.$alert(
          `<image style='width:160px;height:160px;margin: 0 auto' src='${url}'></image>`,
          "体验二维码",
          {
            dangerouslyUseHTMLString: true
          }
        );
      });
    },
    getUpdateCodeList() {
      let para = {
        appid: this.$route.query.appid
      };
      queryCommitMini(para).then(res => {
        this.updateCode = res.data.miniPrograms;
      });
    },
    personnelClick() {
      this.$prompt("请输入微信号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let para = {
            appid: this.$route.query.appid,
            wxNumber: value
          };
          bindTester(para).then(res => {
            this.$message({
              message: "绑定成功",
              type: "success"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消绑定"
          });
        });
    },
    dialogClose(fromName) {
      this[fromName] = {
        requestUrl: [{ value: "" }],
        wsrequestUrl: [{ value: "" }],
        uploadUrl: [{ value: "" }],
        downloadUrl: [{ value: "" }]
      };
    },
    submiltDomain() {
      let para = util.deepcopy(this.domainForm);
      para.appid = this.$route.query.appid;
      para.requestUrl = para.requestUrl.map(data => {
        if (data.value) {
          return `https://${data.value}`;
        }
      });
      para.wsrequestUrl = para.wsrequestUrl.map(data => {
        if (data.value) {
          return `https://${data.value}`;
        }
      });
      para.uploadUrl = para.uploadUrl.map(data => {
        if (data.value) {
          return `https://${data.value}`;
        }
      });
      para.downloadUrl = para.downloadUrl.map(data => {
        if (data.value) {
          return `https://${data.value}`;
        }
      });
      addModifyDomain(para).then(res => {
        this.domainDialogFormVisible = false;
        this.getDomainList();
      });
    },
    removeRequestDomain(funName) {
      this.domainForm[funName].splice(this.domainForm[funName].indexOf(), 1);
    },
    addRequestDomain(funName) {
      this.domainForm[funName].push({ value: "" });
    },
    editorDomainClick(index, row) {
      this.domainDialogFormVisible = true;
      this.$nextTick(() => {
        if (this.tableData[0].url.length) {
          this.domainForm.requestUrl = this.tableData[0].url.map(
            (data, index, arr) => {
              return { value: data };
            }
          );
        }
        if (this.tableData[1].url.length) {
          this.domainForm.wsrequestUrl = this.tableData[1].url.map(
            (data, index, arr) => {
              return { value: data };
            }
          );
        }
        if (this.tableData[2].url.length) {
          this.domainForm.uploadUrl = this.tableData[2].url.map(
            (data, index) => {
              return { value: data };
            }
          );
        }
        if (this.tableData[3].url.length) {
          this.domainForm.downloadUrl = this.tableData[3].url.map(
            (data, index) => {
              return { value: data };
            }
          );
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
        if (rowIndex === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    getDomainList() {
      this.domainLoading = true;
      getModifyDomain({ appid: this.$route.query.appid }).then(res => {
        this.tableData = new Array(
          {
            url: res.data.modifyDomainRes.requestdomain,
            name: "request合法域名"
          },
          {
            url: res.data.modifyDomainRes.wsrequestdomain,
            name: "socket合法域名"
          },
          {
            url: res.data.modifyDomainRes.uploaddomain,
            name: "uploadFile合法域名"
          },
          {
            url: res.data.modifyDomainRes.downloaddomain,
            name: "downloadFile合法域名"
          }
        );
        this.domainLoading = false;
      });
    }
  }
};
</script>
