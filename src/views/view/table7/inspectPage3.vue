<style scoped>
.form_main{
  width: 450px;
  margin: auto;
}
.form_main_title{
  font-size: 24px;
  text-align: center;
}
.result_main{
  background: rgb(235, 235, 235);
  padding: 15px;
  border: 1px solid #999;
  border-radius: 5px;
}
</style>

<template>
  <section class="form_main">
    <p class="form_main_title">手机号鉴权</p>
    <el-form :model="formPhonePower" :rules="rulesPhonePower" ref="formPhonePower" label-width="80px" label-position="left">
        <el-form-item label="姓名" prop="idtfna">
          <el-input v-model="formPhonePower.idtfna"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard">
          <el-input v-model="formPhonePower.idcard"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formPhonePower.mobile"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="phonePower('formPhonePower')">确 定</el-button>
        <el-button @click="resetForm('formPhonePower')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form class="result_main" :model="detForm" v-if="detFormHeidder" label-width="130px" ref="detForm" label-position="left">
      <el-form-item label="姓名：">
        <span>{{detForm.idtfna}}</span>
      </el-form-item>
      <el-form-item label="身份证号：">
        <span>{{detForm.idcard}}</span>
      </el-form-item>
      <el-form-item label="手机号：">
        <span>{{detForm.mobile}}</span>
      </el-form-item>
      <el-form-item label="验证结果：">
        <el-tag :type="resultTag">{{detForm.message}}</el-tag>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import * as util from "../../../util/util.js";
import {
  threeElements
} from "@/api/api";
import { optionsPaymentAll } from "@/util/mockData.js";

export default {
  data() {
    var merchant_id_no = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入身份证号码'));
      } else if (!/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(value)) {
        callback(new Error('请输入正确的身份证号码'));
      } else {
        callback();
      }
    };
    return {
      formPhonePower: {
        idtfna: '',
        mobile: '',
        idcard: ''
      },
      detForm: {},
      detFormHeidder: false,
      resultTag: 'success',
      rulesPhonePower: {
        idtfna: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '姓名长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        idcard: [
          { required: true, message: '请输入身份证件号码', trigger: 'blur' },
          { validator: merchant_id_no, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    phonePower(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('手机鉴权, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let para = util.deepcopy(this.formPhonePower)
            threeElements(para).then(res => {
              let r = {
                idtfna: res.data.idtfna,
                idcard: res.data.idcard,
                mobile: res.data.mobile,
                message: res.message
              }
              this.detFormHeidder = true
              this.detForm = r
              this.resultTag = res.data.status === 'Y' ? 'success' : 'warning'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
