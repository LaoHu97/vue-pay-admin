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
.right_main{
  width: 100%;
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
              <i class="iconfont" :class="[route.meta.icon]"/>
              <span slot="title">{{ route.meta.title }}</span>
            </template>
            <el-menu-item
              v-for="(cRoute, cIndex) in route.children"
              :key="cIndex"
              :index="cRoute.name"
              :route="cRoute"
              v-show="!cRoute.meta.hidden"
            >{{ cRoute.meta.title }}</el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :key="index" :route="route">
            <i class="iconfont" :class="[route.meta.icon]"/>
            <span slot="title">{{ route.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <el-container>
      <div class="right_main">
        <TagsView></TagsView>
        <el-main>
          <keep-alive>
            <router-view v-if="!$route.meta.noCache"></router-view>
          </keep-alive>
          <router-view v-if="$route.meta.noCache"></router-view>
        </el-main>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import addRouter from "@/router";
import {
  TagsView
} from '@/components'
export default {
  components: {
    TagsView
  },
  data() {
    return {
      routerList: {},
      openeds: ['渠道商管理', '商户管理', '信息核查', '交易管理', '对账管理']
    };
  },
  computed: {
    activeMenu() {
      return this.$route.name
    },
    isCollapse() {
      return this.$store.state.viewCollapse.isCollapse;
    },
    indexNum() {
      return this.$store.state.selectTopNum.num;
    }
  },
  watch:{
    indexNum:function(old,newd){
      let n = this.$store.state.selectTopNum.num
      let v = parseInt(n.substr(n.length-1, 1))
      this.routerList = this.$router.options.routes.slice(v+1, v+2)[0];
    }
  },
  mounted() {    
    let v = parseInt(this.$route.path.substr(8, 1));
    this.routerList = this.$router.options.routes.slice(v+1, v+2)[0];
  }
};
</script>
