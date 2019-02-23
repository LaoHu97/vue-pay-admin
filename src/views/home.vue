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
            <el-button type="danger" size="mini" round @click="loginOut">
              退出登录
              <i class="iconfont icon-tuichu"/>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="el_main">
      <router-view/>
    </el-main>
  </el-container>
</template>
<script>
import { loginOut } from "@/api/api";
import index from '../router';
export default {
  data() {
    return {
      activeIndex: '/router03'
    };
  },
  computed: {
    isCollapse() {
      return this.$store.state.viewCollapse.isCollapse;
    }
  },
  mounted() {
    this.activeIndex = sessionStorage.getItem('index') || '/router03'
  },
  methods: {
    selectTopNav(index, path){
      let i = index.substr(index.length-1, 1)
      sessionStorage.setItem("menu", i);
      sessionStorage.setItem("index", index);
      this.$store.dispatch("upload_topNum", i);
    },
    clickEditPassword() {
      this.$router.push({ path: "/account/password" });
    },
    uploadCollapse() {
      this.$store.dispatch("upload_collapse");
    },
    loginOut() {
        this.$confirm('确定退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          loginOut().then(res => {
            this.$router.replace({ path: "/" });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });          
        });
    }
  }
};
</script>
