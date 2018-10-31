<style scoped>
.header_top {
  height: 100%;
  line-height: 60px;
}
.header_top img {
  margin-top: 17px;
}
.header_text {
  text-align: center;
}
.el-main {
  padding: 0;
  position: relative;
}
.main_login {
  width: 240px;
  position: absolute;
  top: 18px;
  right: 65px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.4);
  -webkit-border-radius: 3px;
  border-radius: 3px;
  -moz-border-radius: 3px;
  padding: 14px 35px 0;
  text-align: center;
}
.login_btn {
  width: 240px;
}
.steps_nav {
  padding: 10px 50px;
}
.footer_fix {
  text-align: center;
  line-height: 60px;
}
.login_news {
  padding: 0 50px;
  line-height: 40px;
}
</style>

<template>
  <div>
    <el-container>
      <el-header>
        <el-row
          type="flex"
          justify="space-between"
          class="header_top">
          <el-col :span="8">
            <img
              src="../../assets/images/webwxgetmsgimg.png"
              alt="logo"
              height="25px;">
          </el-col>
          <el-col
            :span="6"
            class="header_text">
            <el-row
              type="flex"
              class="row-bg"
              justify="space-around">
              <el-col :span="8">
                <a target="_blank" href="/admin/web/shop.html">
                  <el-button
                    plain
                    size="mini"
                    round>商户登陆</el-button>
                </a>
              </el-col>
              <el-col :span="8">
                <a target="_blank" href="/admin/web/store.html">
                  <el-button
                    plain
                    size="mini"
                    round>门店登录</el-button>
                </a>
              </el-col>
              <el-col :span="8">
                <a target="_blank" href="/admin/web/emp.html">
                  <el-button
                    plain
                    size="mini"
                    round>款台登录</el-button>
                </a>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-carousel height="360px">
          <el-carousel-item
            v-for="item in 4"
            :key="item">
            <img
              src="@/assets/images/57be6c6cb3d28_1024.jpg"
              alt="轮播图">
          </el-carousel-item>
        </el-carousel>
        <el-form
          ref="loginForm"
          :model="loginForm"
          class="main_login">
          <h3 class="title">登录</h3>
          <el-form-item>
            <el-input
              v-model="loginForm.account"
              type="text"
              size="medium"
              placeholder="请输入用户名">
              <template slot="prepend">
                <svg
                  class="icon"
                  aria-hidden="true">
                  <use xlink:href="#icon-iconzh1"/>
                </svg>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              size="medium"
              placeholder="请输入密码">
              <template slot="prepend">
                <svg
                  class="icon"
                  aria-hidden="true">
                  <use xlink:href="#icon-mima"/>
                </svg>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="inCode">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input
                  v-model="loginForm.inCode"
                  @keyup.enter.native="loginSubmit"
                  type="text"
                  size="medium"
                  placeholder="验证码"/>
              </el-col>
              <el-col :span="12">
                <el-tooltip
                  content="看不清？请点击"
                  placement="top"
                  effect="light">
                  <img
                    @click="clickCode"
                    :src="authCode"
                    width="100%"
                    height="36px"
                    alt="验证码">
                </el-tooltip>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              class="login_btn"
              @click.native.prevent="loginSubmit"
              :loading="isBtnLoading">{{ btnText }}</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <div class="login_news">
        <el-row>
          <el-col :span="2">
            <el-tag type="warning">最新公告</el-tag>
          </el-col>
          <el-col :span="6">
            <el-button type="text">1、帮助商家便捷接入微信、支付宝</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="text">2、帮助商家进行微信公众平台开发运营</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="text">3、《商户平台使用手册》即将上线</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="text">查看更多>></el-button>
          </el-col>
        </el-row>
      </div>
      <div class="steps_nav">
        <h2>商户入驻流程</h2>
        <el-steps
          :active="1"
          align-center>
          <el-step title="提交资料"/>
          <el-step title="审核认证"/>
          <el-step title="开始使用"/>
        </el-steps>
      </div>
      <el-footer class="footer_fix">版权所有：西安万鼎网络科技有限公司 | ICP备 陕17002918号</el-footer>
    </el-container>
  </div>
</template>

<script>
import {
  getCode,
  loginVerify
} from '@/api/api'
export default {
  data () {
    return {
      bImg: require('../../assets/images/57be6c6cb3d28_1024.jpg'),
      isBtnLoading: false,
      authCode: '',
      loginForm: {
        account: '',
        password: '',
        inCode: ''
      }
    }
  },
  computed: {
    btnText () {
      if (this.isBtnLoading) return '登录中...'
      return '立即登录'
    }
  },
  methods: {
    clickCode () {
      this.getAuthCode()
    },
    getAuthCode () {
      this.authCode = `${getCode}?timestamp=${new Date().getTime()}`
    },
    loginSubmit () {
      this.isBtnLoading = true
      let para = this.loginForm
      para.password = this.md5(para.password + para.account)
      loginVerify(para).then(res => {
        this.isBtnLoading = false
        this.$router.replace({ path: 'deal' })
      }).catch(err => {
        this.isBtnLoading = false
        this.$refs.loginForm.resetFields()
        this.getAuthCode()
      })
    }
  },
  mounted () {
    this.getAuthCode()
  }
}
</script>
