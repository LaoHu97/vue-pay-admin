
<style scoped>
.box_card{
  margin-top: 25px;
}
.box-card-pay-icon {
  margin: 0 5px;
  width: 4.5em;
  height: 4.5em;
  vertical-align: -1.6em;
  fill: currentColor;
  overflow: hidden;
}
.box-card-pay-right{
  display: inline-block;
}
.box-card-pay{
  display: flex;
  align-items: center;
}
</style>

<template>
  <section>
    <el-button size="small" round @click="historyGo" style="margin-top:15px;">返回</el-button>
    <el-card class="box_card">
      <div slot="header">
        <span>通道配置</span>
      </div>
      <div class="box-card-pay">
        <svg class="box-card-pay-icon" aria-hidden="true">
          <use xlink:href="#icon-caidan"/>
        </svg>
        <div class="box-card-pay-right">
          <p>官方通道</p>
          <el-button type="text" @click="clickArgument">参数配置</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog title="参数配置" :visible.sync="dialogFormVisibleArgument" width="30%">
      <el-form :model="formArgument" :rules="formArgumentRules" ref="formArgument" label-width="160px" label-position="left">
        <el-form-item label="商户类型" prop="mtype">
          <el-select v-model="formArgument.mtype" placeholder="请选择商户类型">
            <el-option
              v-for="item in optionsMtype"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费率（‰）" prop="rate">
          <el-input v-model="formArgument.rate"></el-input>
        </el-form-item>
        <!-- <el-form-item label="封顶值（￥）">
          <el-input-number v-model="formArgument.rate_cap" :controls="false" :precision="0" :step="1" :min="18" :max="500"></el-input-number>
        </el-form-item>
        <el-form-item label="通道商户号">
          <el-input v-model="formArgument.thirdMid"></el-input>
        </el-form-item>
        <el-form-item label="通道秘钥">
          <el-input v-model="formArgument.thirdMkey"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleArgument = false">取 消</el-button>
        <el-button type="primary" @click="submiltArgument('formArgument')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import * as util from "@/util/util.js";
import {
  queryMerPayConfig,
  updateMerPayConfig
} from "@/api/api";
import { optionsPaymentAll } from "@/util/mockData.js";

export default {
  data() {
      var validaterate = (rule, value, callback) => {
        if (!/^(\-)?\d+(\.\d{2})?$/.test(value)) {
          callback(new Error('请输入正确的商户费率'));
        } else {
          callback();
        }
      };
    return {
      dialogFormVisibleArgument: false,
      optionsMtype: [{
        value: '22',
        label: '包商支付宝'
      }],
      formArgumentRules: {
        mtype: [
          { required: true, message: '请选择商户类型', trigger: 'change' }
        ],
        rate: [
          { required: true, message: '请输入商户费率', trigger: 'blur' },
          { validator: validaterate, trigger: 'blur' }
        ]
      },
      formArgument: {
        mtype: '22',
        rate: '',
        rate_cap: '',
        thirdMid: '',
        thirdMkey: ''
      }
    };
  },
  methods: {
    historyGo() {
      this.$router.go(-1)
    },
    clickArgument() {
      this.dialogFormVisibleArgument = true
      this.$nextTick(() => {
        this.$refs.formArgument.resetFields()
        queryMerPayConfig({mid: parseInt(this.$route.query.mid), payType: '020'}).then(res => {
          if (res.data) {
            this.formArgument.rate = res.data.rate
            // this.formArgument.rate_cap = res.data.queryMerPayConfig.rate_cap
            // this.formArgument.thirdMid = res.data.queryMerPayConfig.thirdMid
            // this.formArgument.thirdMkey = res.data.queryMerPayConfig.thirdMkey
          }
        })
      })
    },
    submiltArgument(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let para = util.deepcopy(this.formArgument)
          para.mid = parseInt(this.$route.query.mid)
          para.pay_type = '020'
          para.rate = para.rate.toString()
          // para.rate_cap = para.rate_cap.toString()
          updateMerPayConfig(para).then(res => {
            this.dialogFormVisibleArgument = false
            this.$message({
              message: res.message,
              type: 'success'
            });
          })
        } else {
          return
        }
      });
    }
  }
};
</script>
