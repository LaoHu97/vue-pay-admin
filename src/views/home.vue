<style scoped>
.header_top_collaspe .iconfont {
  font-size: 20px;
}
.header_top img {
  margin-top: 17px;
  float: left;
}
.header_top_btn {
  text-align: center;
  line-height: 60px;
}
.header_top_btn .iconfont {
  font-size: 12px;
  margin-left: 5px;
}
.header_top_xian {
  border-bottom: solid 1px #e6e6e6;
}
.header_top_collaspe {
  margin: 12px 20px;
}
.el_main {
  padding: 0;
}
</style>

<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" class="header_top">
        <el-col :span="8" class="header_top_xian">
          <img src="@/assets/images/webwxgetmsgimg.png" alt="logo" height="25px;">
          <el-button type="text" size="mini" class="header_top_collaspe" @click="uploadCollapse">
            <i class="iconfont icon-ego-menu-copy" v-if="isCollapse"/>
            <i class="iconfont icon-ego-menu" v-else/>
          </el-button>
        </el-col>
        <el-col :span="13">
          <el-menu :default-active="activeIndex" mode="horizontal" router @select="selectTopNav">
            <template v-for="(route, index) in $router.options.routes">
              <el-menu-item
                :key="index"
                :route="route"
                :index="route.path"
                v-if="!route.meat.hidden"
              >
                <span slot="title">{{ route.meat.name }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-col>
        <el-col :span="3" class="header_text header_top_xian">
          <div class="header_top_btn">
            <!-- <el-button type="danger" size="mini" round @click="loginOut">
              退出登录
              <i class="iconfont icon-tuichu"/>
            </el-button> -->
            <el-dropdown split-button size="mini" type="danger" @click="loginOut">退出登录
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="handleEdit">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <!--修改密码-->
    <el-dialog
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="380px"
    >
      <el-alert title="提示：密码修改成功后需重新登录" type="warning" center show-icon :closable="false"></el-alert>
      <el-form :model="ruleForm" :rules="rulesPassword" ref="ruleForm">
        <el-form-item label="旧密码" prop="usedPass">
          <el-input type="password" v-model.trim="ruleForm.usedPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model.trim="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model.trim="ruleForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editFormVisible=false">取消</el-button>
        <el-button type="primary" :loading="submitFormLogining" @click="submitForm('ruleForm')">提交</el-button>
      </div>
    </el-dialog>
    <el-main class="el_main">
      <router-view/>
    </el-main>
  </el-container>
</template>
<script>
import { loginOut, updateAdminPwd } from "@/api/api";
import index from "../router";
import { TagsView } from "@/components";
export default {
  components: {
    TagsView
  },
  data() {
    // 修改密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("旧密码不能为空"));
      } else {
        callback();
      }
    };
      var validatePass1 = (rule, value, callback) => {
        let regex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,18}');
        let han = new RegExp("[\\u4E00-\\u9FFF]+","g");
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!regex.test(value)) {
          callback(new Error('请输入包含大小写字母、数字、特殊字符的8到18位密码'));
        } else if (han.test(value)) {
          callback(new Error('请输入包含大小写字母、数字、特殊字符的8到18位密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      editFormVisible: false, //修改密码弹窗是否显示
      editLoading: false,
      submitFormLogining: false,
      //修改密码弹窗数据
      ruleForm: {
        pass: "",
        checkPass: "",
        usedPass: ""
      },
      rulesPassword: {
        usedPass: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur"
          }
        ],
        pass: [
          {
            required: true,
            validator: validatePass1,
            trigger: "blur"
          },
            {
              min: 8,
              max: 18,
              message: '请输入包含大小写字母、数字、特殊字符的8到18位密码',
              trigger: 'blur'
            }
        ],
        checkPass: [
          {
            required: true,
            validator: validatePass2,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    isCollapse() {
      return this.$store.state.viewCollapse.isCollapse;
    },
    activeIndex() {
      return this.$route.path.substr(0, 9);
    }
  },
  mounted() {},
  methods: {
    //修改密码弹框是否弹出
    handleEdit: function() {
      this.editFormVisible = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    //修改密码提交按钮
    submitForm() {
      let account = JSON.parse(sessionStorage.getItem("account"));
      if (!account) {
        return this.$message("找不到帐号，请重新登录或联系技术人员");
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let para = {
            oldPwd: this.md5(this.ruleForm.usedPass + account),
            mpwd: this.md5(this.ruleForm.pass + account),
            mpwd2: this.md5(this.ruleForm.checkPass + account)
          };
          this.submitFormLogining = true;
          updateAdminPwd(para).then(res => {
            this.submitFormLogining = false;
            this.$message({
              message: res.message,
              type: "success"
            });
            //回到登录页
            this.$router.replace({ path: "/" });
          }).catch(err => {
            this.submitFormLogining = false;
          });
        }
      });
    },
    selectTopNav(index) {
      console.log("点击头部导航" + index);

      this.$store.dispatch("upload_topNum", index);
    },
    clickEditPassword() {
      this.$router.push({ path: "/account/password" });
    },
    uploadCollapse() {
      this.$store.dispatch("upload_collapse");
    },
    loginOut() {
      this.$confirm("确定退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          loginOut().then(res => {
            this.$router.replace({ path: "/" });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
            showClose: true
          });
        });
    }
  }
};
</script>
