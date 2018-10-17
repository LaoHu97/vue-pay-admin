<style scoped>
.shop_from {
  max-width: 450px;
  margin: 45px auto;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>

<template>
  <section>
    <el-form ref="form" :model="form" class="shop_from" label-position="left" label-width="120px">
      <p style="text-align:center">
        <i class="el-icon-edit"></i>商户信息</p>
      <el-form-item label="商户全称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="商户简称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="商户费率">
        <el-input-number v-model="num9" :precision="2" :step="0.1" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item label="商户模式">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属商户号">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理商">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="第三方回调路径">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="模板通知公众号">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="父商户号">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
export default {
  data () {
    return {
      form: {
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>
