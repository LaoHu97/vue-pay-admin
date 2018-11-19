<style scoped>
.el-container {
  height: 100%;
}
.header_top_collaspe .iconfont {
  font-size: 20px;
}
.el-menu-vertical .iconfont {
  color: #fff;
  margin-right: 5px;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #fff;
  color: #333;
}
.el-container {
  height: 100%;
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
        <el-col :span="10">
          <el-menu :default-active="activeIndex" mode="horizontal" router>
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
        <el-col :span="6" class="header_text header_top_xian">
          <div class="header_top_btn">
            <el-button
              type="warning"
              size="mini"
              round
            @click="clickEditPassword">修改密码<i class="iconfont icon-xiugai"/></el-button>
            <el-button type="danger" size="mini" round @click="loginOut">退出登录
              <i class="iconfont icon-tuichu"/>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-menu
        :default-active="$route.name"
        :collapse="isCollapse"
        class="el-menu-vertical"
        background-color="#414F61"
        text-color="#fff"
        active-text-color="#409EFF"
        router
        unique-opened
      >
        <template v-for="(route, index) in $router.options.routes[2].children">
          <template v-if="route.children">
            <el-submenu :key="index" :index="route.name">
              <template slot="title">
                <i class="iconfont" :class="[route.meat.icon]"/>
                <span slot="title">{{ route.meat.name }}</span>
              </template>
              <el-menu-item
                v-for="(cRoute, cIndex) in route.children"
                :key="cIndex"
                :index="cRoute.name"
                :route="cRoute"
                v-if="!cRoute.meat.hidden"
              >{{ cRoute.meat.name }}</el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :key="index" :route="route">
              <i class="iconfont" :class="[route.meat.icon]"/>
              <span slot="title">{{ route.meat.name }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
      <el-container>
        <el-main>
          <el-breadcrumb separator="/">
            <template v-for="(item, index) in $route.matched">
              <el-breadcrumb-item :key="index">{{ item.name }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { loginOut } from "@/api/api";
export default {
  data() {
    return {
      activeIndex: "/deal"
    };
  },
  computed: {
    isCollapse() {
      return this.$store.state.viewCollapse.isCollapse;
    }
  },
  mounted() {
    console.log(this);
  },
  methods: {
    clickEditPassword() {
      this.$router.push({ path: "/account/password" });
    },
    uploadCollapse() {
      this.$store.dispatch("upload_collapse");
    },
    loginOut() {
      loginOut().then(res => {
        this.$router.replace({ path: "/" });
      });
    }
  }
};
</script>
