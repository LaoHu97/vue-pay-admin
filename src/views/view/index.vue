<style scoped>
.el-menu-vertical .iconfont {
  color: #fff;
  margin-right: 5px;
}
.el-menu-vertical {
  width: 200px;
  min-height: 800px;
}
.el-menu--collapse{
  width: auto;
}
.el-container {
  height: 100%;
}
</style>

<template>
  <el-container>
    <el-menu
      :default-active="$route.name"
      :collapse="isCollapse"
      class="el-menu-vertical"
      background-color="#414F61"
      text-color="#fff"
      active-text-color="#fff"
      router
      :default-openeds="openeds"
    >
      <template v-for="(route, index) in routerList.children">
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
              v-show="!cRoute.meat.hidden"
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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import addRouter from "@/router";
export default {
  data() {
    return {
      routerList: {},
      openeds: ['渠道商管理', '商户管理', '信息核查', '交易管理', '对账管理']
    };
  },
  computed: {
    isCollapse() {
      return this.$store.state.viewCollapse.isCollapse;
    },
    indexNum() {
      return this.$store.state.selectTopNum.num;
    }
  },
  watch:{
    indexNum:function(old,newd){
      let v = parseInt(this.$store.state.selectTopNum.num)
      this.routerList = this.$router.options.routes.slice(v+1, v+2)[0];
    }
  },
  mounted() {
      let v = parseInt(sessionStorage.getItem('menu'));
      this.routerList = this.$router.options.routes.slice(v+1, v+2)[0];
  },
};
</script>
