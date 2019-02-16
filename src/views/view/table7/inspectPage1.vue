<style scoped>
.form_main{
  width: 450px;
  margin: auto;
}
.form_main_title{
  font-size: 24px;
  text-align: center;
}
</style>

<template>
  <section class="form_main">
    <p class="form_main_title">联网核查</p>
    <el-form :model="formNetworking" :rules="rulesNetworking" ref="formNetworking" label-width="80px" label-position="left">
      <el-form-item label="姓名" prop="idtfna">
        <el-input v-model="formNetworking.idtfna"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idcard">
        <el-input v-model="formNetworking.idcard"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="networkingClick('formNetworking')">确 定</el-button>
        <el-button @click="resetForm('formNetworking')">重置</el-button>
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
      formNetworking: {
        idtfna: '',
        idcard: ''
      },
      rulesNetworking: {
        idtfna: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '姓名长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        idcard: [
          { required: true, message: '请输入身份证件号码', trigger: 'blur' },
          { validator: merchant_id_no, trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    networkingClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('联网核查, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let para = util.deepcopy(this.formNetworking)
            threeElements(para).then(res => {
              this.$message({
                type: 'success',
                message: res.message
              });
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
