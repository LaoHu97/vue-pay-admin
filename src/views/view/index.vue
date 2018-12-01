<style scoped>
.el-menu-vertical .iconfont {
  color: #fff;
  margin-right: 5px;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 800px;
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
      active-text-color="#409EFF"
      router
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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    isCollapse() {
      return this.$store.state.viewCollapse.isCollapse;
    }
  },
  methods: {},
  mounted() {
    console.log(this);
  }
};
</script>
