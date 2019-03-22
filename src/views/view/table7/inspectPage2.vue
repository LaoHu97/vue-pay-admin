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
    <p class="form_main_title">银行卡核查</p>
    <el-form :model="formFourElements" :rules="rulesFourElements" ref="formFourElements" label-width="140px" label-position="left">
        <el-form-item label="证件姓名" prop="idtfna">
          <el-input v-model="formFourElements.idtfna"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="idtftp">
          <el-select
            v-model="formFourElements.idtftp"
            placeholder="请输入证件类型关键字查询"
            :multiple="false"
            filterable
            remote
            :remote-method="remoteMerchantType"
            :loading="MerchantTypeLoading"
            clearable
            @focus="clickMerchantType"
          >
            <el-option
              v-for="item in optionsMerchantType"
              :key="item.id"
              :value="item.code"
              :label="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="idtfno">
          <el-input v-model="formFourElements.idtfno"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="cardno">
          <el-input v-model="formFourElements.cardno"></el-input>
        </el-form-item>
        <el-form-item label="银行预留手机号" prop="mobile">
          <el-input v-model="formFourElements.mobile"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fourElements('formFourElements')">确 定</el-button>
        <el-button @click="resetForm('formFourElements')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form class="result_main" :model="detForm" v-if="detFormHeidder" label-width="130px" ref="detForm" label-position="left">
      <el-form-item label="证件姓名：">
        <span>{{detForm.idtfna}}</span>
      </el-form-item>
      <el-form-item label="证件类型：">
        <span>{{detForm.idtftp}}</span>
      </el-form-item>
      <el-form-item label="证件号码：">
        <span>{{detForm.idtfno}}</span>
      </el-form-item>
      <el-form-item label="银行卡号：">
        <span>{{detForm.cardno}}</span>
      </el-form-item>
      <el-form-item label="银行预留手机号：">
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
  threeElements,
  fourElements,
  bsbLegalDocumentType
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
    var number_phone = (rule, value, callback) => {
      if (!/^1(3|4|5|7|8)\d{9}$/.test(value) && value !== '') {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    }
    return {
      formFourElements: {
        idtfna: '',
        mobile: '',
        idtftp: '',
        idtfno: '',
        cardno: ''
      },
      detForm: {},
      detFormHeidder: false,
      resultTag: 'success',
      rulesFourElements: {
        idtfna: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '姓名长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: number_phone, trigger: 'blur' }
        ],
        idtftp: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        idtfno: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        cardno: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' }
        ],
      },
      MerchantTypeLoading: false,
      optionsMerchantType: []
    };
  },
  methods: {
    fourElements(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('联网核查四要素, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let para = util.deepcopy(this.formFourElements)
            fourElements(para).then(res => {
              let r = {
                idtfna: res.data.idtfna,
                mobile: res.data.mobile,
                idtftp: res.data.idtftp,
                idtfno: res.data.idtfno,
                cardno: res.data.cardno,
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
    clickMerchantType() {
      this.MerchantTypeLoading = true;
      bsbLegalDocumentType({ id: "123" }).then(res => {
        this.MerchantTypeLoading = false;
        this.optionsMerchantType = res.data;
      });
    },
    remoteMerchantType(query) {
      if (query !== "") {
        this.MerchantTypeLoading = true;
        setTimeout(() => {
          this.MerchantTypeLoading = false;
          bsbLegalDocumentType({
            type: query
          }).then(res => {
            this.optionsMerchantType = res.data;
          });
        }, 200);
      } else {
        this.optionsMerchantType = [];
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
