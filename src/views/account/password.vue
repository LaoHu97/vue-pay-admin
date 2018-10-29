<style scoped>
.pass_word {
  width: 320px;
  margin: 10px auto;
  padding-top: 45px;
  text-align: center;
}
.password_main {
  background: #f9f9f9;
  height: 100%;
}
</style>

<template>
  <section class="password_main">
    <el-form
      ref="passWordForm"
      :model="passWordForm"
      :rules="passWordFormRules"
      label-width="80px"
      class="pass_word">
      <p>修改密码</p>
      <el-form-item
        label="原始密码"
        prop="usedPass">
        <el-input v-model="passWordForm.usedPass"/>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="pass">
        <el-input v-model="passWordForm.pass"/>
      </el-form-item>
      <el-form-item
        label="再次输入"
        prop="checkPass">
        <el-input v-model="passWordForm.checkPass"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit">确认修改</el-button>
        <el-button @click="giveUpEditPassword">放弃修改</el-button>
      </el-form-item>
      <el-alert
        title="密码修改成功后需要重新登录"
        type="warning"
        center
        show-icon
        :closable="false"/>
    </el-form>
  </section>
</template>
<script>
export default {
  data () {
    //  修改密码
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('原始密码不能为空'))
      } else {
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!/^[a-zA-Z0-9]{6,18}$/.test(value)) {
        callback(new Error('请输入不含汉字和空格的6到18位密码'))
      } else {
        if (this.passWordForm.checkPass !== '') {
          this.$refs.passWordForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passWordForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passWordForm: {
        pass: '',
        checkPass: '',
        usedPass: ''
      },
      passWordFormRules: {
        usedPass: [{
          required: true,
          validator: validatePass,
          trigger: 'blur'
        },
        {
          min: 6,
          max: 18,
          message: '密码为6到18位数字或字母',
          trigger: 'blur'
        }
        ],
        pass: [{
          required: true,
          validator: validatePass1,
          trigger: 'blur'
        },
        {
          min: 6,
          max: 18,
          message: '密码为6到18位数字或字母',
          trigger: 'blur'
        }
        ],
        checkPass: [{
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        },
        {
          min: 6,
          max: 18,
          message: '密码为6到18位数字或字母',
          trigger: 'blur'
        }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    giveUpEditPassword () {
      this.$router.go(-1)
    }
  }
}
</script>
