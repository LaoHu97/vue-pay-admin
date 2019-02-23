<style scoped>
.search_top {
  background: #f2f2f2;
  margin: 20px 0;
  padding: 20px 10px 0 10px;
}
.top_alert {
  margin-top: 20px;
}
.box-card{
  margin-top: 10px;
}
.box_card_img{
  width: 100px;
  height: 100px;
}
.form_item{
  color: #f00;
  font-size: 8px;
  margin: 0;
}
</style>
<style>
.fixed_search_input {
  max-width: 160px;
}
.fixed_search_date {
  max-width: 220px;
}
</style>

<template>
  <section>
    <el-form
      :inline="true"
      :model="filters"
      label-position="left"
      ref="filters"
      label-width="80px">
      <div class="search_top">
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="代理名称"
              prop="agent_id">
              <el-input
                v-model.trim="filters.agent_id"
                placeholder="请输入代理名称关键字"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="商户名称"
              prop="merchant_name">
              <el-input
                v-model.trim="filters.merchant_name"
                placeholder="请输入商户名称关键字"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="审核状态"
              prop="merchant_status">
              <el-select
                v-model="filters.merchant_status"
                clearable
                placeholder="请选择审核状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="float: right;">
              <el-button
                type="primary"
                @click="getUsers"
                round
                icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--列表-->
    <div v-loading="listLoading">
      <el-table
        :data="users"
        border
        stripe
        highlight-current-row>
        <el-table-column
          prop="userName"
          align="center"
          label="代理名称"
          min-width="120"/>
        <el-table-column
          prop="merchant_name"
          align="center"
          label="商户名称"
          min-width="120"/>
        <el-table-column
          prop="gmt_create"
          align="center"
          label="创建时间"
          min-width="120"
          :formatter="formatterDateCreate"/>
        <el-table-column
          prop="gmt_modified"
          align="center"
          label="更新时间"
          min-width="120"
          :formatter="formatterDateModified"/>
        <el-table-column
          align="center"
          label="审核状态"
          min-width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.merchant_status === '0' ? 'info' : scope.row.merchant_status === '1' ? 'warning': scope.row.merchant_status === '2' ? 'danger' : 'success'"
              disable-transitions>{{ formatMerchantStatus(scope.row, scope.$index) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="320">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="handleDetail(scope.$index, scope.row)">审核</el-button>
            <el-button
              type="warning"
              size="mini"
              :disabled="scope.row.merchant_status !== '3'"
              @click="synchronousPay(scope.$index, scope.row)">同步支付信息</el-button>
            <!-- <el-button
              type="success"
              size="mini"
              :disabled="scope.row.merchant_status !== '1'"
              @click="handleRefund(scope.$index, scope.row)">审核</el-button> -->
            <!-- <el-dropdown>
              <el-button size="mini" type="primary" style="margin-left:10px">
                实名认证<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    type="text"
                    size="mini"
                    @click="networkingOpen('formNetworking')">联网核查</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    size="mini"
                    @click="fourElementsOpen('formFourElements')">四要素</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    size="mini"
                    @click="phonePowerOpen('formPhonePower')">手机鉴权</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="联网核查" :visible.sync="dialogFormVisibleNetworking" width="450px">
      <el-form :model="formNetworking" :rules="rulesNetworking" ref="formNetworking">
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="formNetworking.realname"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard">
          <el-input v-model="formNetworking.idcard"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleNetworking = false">取 消</el-button>
        <el-button type="primary" @click="networkingClick('formNetworking')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="四要素" :visible.sync="dialogFormVisibleFourElements" width="450px">
      <el-form :model="formFourElements" :rules="rulesFourElements" ref="formFourElements">
        <el-form-item label="姓名" prop="idtfna">
          <el-input v-model="formFourElements.idtfna"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formFourElements.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleFourElements = false">取 消</el-button>
        <el-button type="primary" @click="fourElements('formFourElements')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="手机鉴权" :visible.sync="dialogFormVisiblePhonePower" width="450px">
      <el-form :model="formPhonePower" :rules="rulesPhonePower" ref="formPhonePower">
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="formPhonePower.realname"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard">
          <el-input v-model="formPhonePower.idcard"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formPhonePower.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblePhonePower = false">取 消</el-button>
        <el-button type="primary" @click="fourElements('formPhonePower')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="商户详情"
      :visible.sync="dialogDetailVisible"
      width="800px">
      <el-form
        :model="formDetail"
        label-width="150px"
        label-position="left">
        <el-alert
          class="box-alert"
          :closable="false"
          v-if="formDetail.merchant_status === '2'"
          title="审核驳回原因："
          :description="formDetail.error_msg || '暂无驳回原因，请联系运营人员'"
          type="error"
          show-icon/>
        <h2 style="text-align: center;">商户名称：{{ formDetail.merchant_name }}</h2>
        <el-card>
          <div slot="header">
            <span>基本信息</span>
          </div>
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="商户简称">
                  <span>{{ formDetail.merchant_alias }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注册名称">
                  <span>{{ formDetail.merchant_company }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="商户所在省/市/县">
                  <span>{{ formDetail.merchant_province }} {{ formDetail.merchant_province ? '/' : '' }} {{ formDetail.merchant_city }} {{ formDetail.merchant_city ? '/' : '' }} {{ formDetail.merchant_county }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商户详细地址">
                  <span>{{ formDetail.merchant_address }}</span>
                  <p class="form_item" v-show="formDetail.merchant_address">系统中已有{{addressCount}}条重复数据</p>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="商户联系人">
                  <span>{{ formDetail.merchant_person }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人电话">
                  <span>{{ formDetail.merchant_phone }}</span>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="联系人证件号">
                  <span>{{formDetail.person_id_no}}</span>
                  <p class="form_item" v-show="formDetail.person_id_no">系统中已有{{personCount}}条重复数据</p>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人证件有效期">
                  <span>{{formatDateperson_id_no(formDetail)}}</span>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="联系人邮箱">
                  <span>{{ formDetail.merchant_email }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="行业类目">
                  <span>{{ formDetail.business_name }}</span>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="客服电话">
                  <span>{{ formDetail.merchant_service_phone }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商户类型">
                  <span>{{ formDetail.merchant_type === '1' ? '一级商户' : formDetail.merchant_type === '2' ? '二级商户' : '未知' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <!-- 第二页 -->
        <el-card class="box-card">
          <div slot="header">
            <span>结算信息</span>
          </div>
          <div>
            <el-row>
          <el-col :span="12">
            <el-form-item label="商户结算入网类型">
              <span>{{formDetail.settlement_mer_type === 'QY' ? '企业' : formDetail.settlement_mer_type === 'GT' ? '个体' : formDetail.settlement_mer_type === 'XW' ? '小微' : ''}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执照证件号码">
              <span>{{formDetail.licenseno}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="证件到期日期">
              <span>{{formatDateLicensen_expire(formDetail)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算账户类型">
              <span>{{formDetail.account_type === '1' ? '对公' : formDetail.account_type === '2' ? '对私' : ''}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="入网证件类型">
              <span>{{formDetail.document_type === 'SZHY' ? '三证合一' : formDetail.document_type === 'YYZZ' ? '营业执照' : ''}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否法人入账">
              <span>{{formDetail.is_liable_account === '1' ? '法人入账' : formDetail.is_liable_account === '2' ? '非法人入账' : ''}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="法人姓名">
              <span>{{formDetail.legal_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人证件类型">
              <span>{{formDetail.merchant_id_type_name}}</span>
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="12">
            <el-form-item label="法人证件号">
              <span>{{formDetail.merchant_id_no}}</span>
              <p class="form_item" v-show="formDetail.merchant_id_no">系统中已有{{cardCount}}条重复数据</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人证件有效期">
              <span>{{formatDatemerchant_id_expire(formDetail)}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="法人手机号">
              <span>{{formDetail.legal_phone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算人身份证号">
              <span>{{formDetail.settle_id_no}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算人身份证有效期">
              <span>{{formatDatesettle_id_expire(formDetail)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算人账户开户名">
              <span>{{formDetail.account_name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算人账户开户号">
              <span>{{formDetail.account_no}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行卡预留手机号">
              <span>{{formDetail.account_phone}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算账户开户行">
              <span>{{formDetail.bank_zname}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算户开户支行">
              <span>{{formDetail.bank_name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务员">
              <span>{{formDetail.salesman_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制人姓名">
              <span>{{formDetail.contro_name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="控制人证件类型">
              <span>{{formDetail.contro_id_type_name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制人证件号">
              <span>{{formDetail.contro_id_no}}</span>
              <p class="form_item" v-show="formDetail.contro_id_no">系统中已有{{controCount}}条重复数据</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="控制人证件有效期">
              <span>{{formatDatecontro_id_expire(formDetail)}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span>微信</span>
            <el-tag :type="formDetail.wx_open === 'Y' ? 'success' : 'warning'" style="float: right;">{{formDetail.wx_open === 'Y' ? '开启' : formDetail.wx_open === 'N' ? '关闭' : '未知'}}</el-tag>
          </div>
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="微信费率（‰）">
                  <span>{{ formDetail.wx_rate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人微信账号">
                  <span>{{ bsbPay.wx_contid }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span>支付宝</span>
            <el-tag :type="formDetail.ali_open === 'Y' ? 'success' : 'warning'" style="float: right;">{{formDetail.ali_open === 'Y' ? '开启' : formDetail.ali_open === 'N' ? '关闭' : '未知'}}</el-tag>
          </div>
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付宝费率（‰）">
                  <span>{{ formDetail.ali_rate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="支付宝的PID">
                  <span>{{ bsbPay.ali_source }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="行业类目">
                  <span>{{ bsbPay.reserve1 }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span>银行卡费率</span>
          </div>
          <div><el-row>
              <el-col :span="12">
                <el-form-item label="翼支付费率">
                  <span>{{ formDetail.best_rate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="借记卡费率">
                  <span>{{ formDetail.debit_rate }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<el-tag>费率峰值：{{ formDetail.reserve1 }}元</el-tag>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="贷记卡费率">
                  <span>{{ formDetail.crebit_rate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银联费率">
                  <span>{{ formDetail.unionpay_rate }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <!-- 商户照片 -->
        <el-card class="box-card">
          <div slot="header">
            <span>证件照片</span>
            <a :href="formDetail.img_other" v-if="formDetail.img_other" style="float: right; padding: 3px 0" type="text">补充资料</a>
          </div>
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="营业执照照片">
                  <a
                    :href="formDetail.img_business_license"
                    v-if="formDetail.img_business_license"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_business_license"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法人身份证正面">
                  <a
                    :href="formDetail.img_idcard_a"
                    v-if="formDetail.img_idcard_a"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_idcard_a"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="法人身份证反面">
                  <a
                    :href="formDetail.img_idcard_b"
                    v-if="formDetail.img_idcard_b"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_idcard_b"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银行卡正面照片">
                  <a
                    :href="formDetail.img_bankcard_a"
                    v-if="formDetail.img_bankcard_a"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_bankcard_a"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="银行卡反面照片">
                  <a
                    :href="formDetail.img_bankcard_b"
                    v-if="formDetail.img_bankcard_b"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_bankcard_b"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商户门头照片">
                  <a
                    :href="formDetail.img_logo"
                    v-if="formDetail.img_logo"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_logo"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="内部前台照片">
                  <a
                    :href="formDetail.img_indoor"
                    v-if="formDetail.img_indoor"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_indoor"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开户许可证照片">
                  <a
                    :href="formDetail.img_open_permits"
                    v-if="formDetail.img_open_permits"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_open_permits"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row><el-row>
              <el-col :span="12">
                <el-form-item label="商户关系证明">
                  <a
                    :href="formDetail.img_relation"
                    v-if="formDetail.img_relation"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_relation"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结算人身份证正面">
                  <a
                    :href="formDetail.img_private_idcard_a"
                    v-if="formDetail.img_private_idcard_a"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_private_idcard_a"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="结算人身份证反面">
                  <a
                    :href="formDetail.img_private_idcard_b"
                    v-if="formDetail.img_private_idcard_b"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_private_idcard_b"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商户总分店关系证明">
                  <a
                    :href="formDetail.img_mer_relation"
                    v-if="formDetail.img_mer_relation"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_mer_relation"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="商户增值协议">
                  <a
                    :href="formDetail.img_mer_increment"
                    v-if="formDetail.img_mer_increment"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_mer_increment"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组织机构代码证照片">
                  <a
                    :href="formDetail.img_org_code"
                    v-if="formDetail.img_org_code"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_org_code"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="税务登记证照片">
                  <a
                    :href="formDetail.img_tax_reg"
                    v-if="formDetail.img_tax_reg"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_tax_reg"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人身份证正面">
                  <a
                    :href="formDetail.img_person_a"
                    v-if="formDetail.img_person_a"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_person_a"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系人身份证反面">
                  <a
                    :href="formDetail.img_person_b"
                    v-if="formDetail.img_person_b"
                    target='_blank'>
                    <img
                      class="box_card_img"
                      :src="formDetail.thum_img_person_b"
                      alt="证件照片">
                  </a>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-form v-if="formDetail.merchant_status === '1'" :model="formDialog" label-position="left" label-width="100px" ref="formDialog" style="margin-top:25px;">
          <el-form-item label="备注信息" prop="error_msg" :rules="[{ required: true, message: '请输入备注信息', trigger: 'blur' }]">
            <el-input
              type="textarea"
              v-model="formDialog.error_msg"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入备注信息"/>
          </el-form-item>
          <el-form-item label-width="0" prop="radioRefund" style="text-align: center;">
              <el-button type="success" size="d" @click="submitRefund('formDialog', '3')">通 过</el-button>
              <el-button type="danger" size="d" @click="submitRefund('formDialog', '2')">驳 回</el-button>
          </el-form-item>
        </el-form>
      </el-form>
    </el-dialog>
    <el-dialog
      title="商户审核"
      :visible.sync="dialogRefundVisible"
      width="420px">
      <el-form
        :model="formDialog"
        ref="formDialog">
        <el-form-item prop="radioRefund">
          <el-radio
            v-model="formDialog.radioRefund"
            label="3">通过</el-radio>
          <el-radio
            v-model="formDialog.radioRefund"
            label="2">驳回</el-radio>
        </el-form-item>
        <el-form-item
          label="备注信息"
          prop="error_msg"
          :rules="[{ required: true, message: '请输入备注信息', trigger: 'blur' }]">
          <el-input
            type="textarea"
            v-model="formDialog.error_msg"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注信息"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRefundVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRefund('formDialog')">确 定</el-button>
      </span>
    </el-dialog>
    <!--工具条-->
    <el-row>
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        background
        style="text-align:center;background:#fff;padding:15px;"/>
    </el-row>
  </section>
</template>

<script>
import { changeAgentMerEnter, ChangeAgentShop, changeStatus, downloadAgentImages, openWxAli, fourElements, threeElements, repeatRemind } from '@/api/api'
import { optionsFormDetail } from '@/util/mockData.js'
import getUsersList from '@/mixins/Users'
import getRemoteSearch from '@/mixins/RemoteSearch'
import * as util from '../../../util/util.js'

export default {
  mixins: [getUsersList, getRemoteSearch],
  data () {
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
      if (!/^\d{7,15}$/.test(value) && value !== '') {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    }
    return {
      filters: {},

      addressCount: 1,
      cardCount: 1,
      controCount: 1,
      personCount: 1,

      downloadAgentImages: '',
      dialogDetailVisible: false,
      dialogRefundVisible: false,
      id: '',
      shop_id: '',
      formDialog: {
        radioRefund: '3',
        error_msg: ''
      },
      optionsFormDetail: optionsFormDetail,
      statusOptions: [
        {
          value: '1',
          label: '审核中'
        },
        {
          value: '2',
          label: '审核驳回'
        },
        {
          value: '3',
          label: '审核通过'
        }
      ],
      formDetail: {},
      bsbPay: {},


      dialogFormVisibleNetworking: false,
      formNetworking: {
        realname: '',
        idcard: ''
      },
      rulesNetworking: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '姓名长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        idcard: [
          { required: true, message: '请输入身份证件号码', trigger: 'blur' },
          { validator: merchant_id_no, trigger: 'blur' }
        ]
      },

      dialogFormVisibleFourElements: false,
      formFourElements: {
        idtfna: '',
        mobile: '',
        idtftp: '01'
      },
      rulesFourElements: {
        idtfna: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '姓名长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: number_phone, trigger: 'blur' }
        ]
      },

      dialogFormVisiblePhonePower: false,
      formPhonePower: {
        realname: '',
        mobile: '',
        idcard: ''
      },
      rulesPhonePower: {
        realname: [
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
    }
  },
  methods: {
    // 状态转换
    formatMerchantStatus: function (row, column) {
      return row.merchant_status === '0' ? '未提交' : row.merchant_status === '1' ? '审核中' : row.merchant_status === '2' ? '审核驳回' : '审核通过'
    },
    formatterDateCreate (row, column) {
      return row.gmt_create = util.formatDate.format(new Date(row.gmt_create), 'yyyy/MM/dd hh:mm:ss')
    },
    formatterDateModified (row, column) {
      return row.gmt_modified = util.formatDate.format(new Date(row.gmt_modified), 'yyyy/MM/dd hh:mm:ss')
    },
    formatDate (val) {
      return util.dateFormat(parseInt(val), 'yyyy-MM-dd hh:mm:ss')
    },
    formatDateLicensen_expire (val) {
      return val.licensen_expire_long === 'Y' ? '长期有效' : val.licensen_expire ? util.dateFormat(parseInt(val.licensen_expire), 'yyyy-MM-dd hh:mm:ss') : ''
    },
    formatDatemerchant_id_expire (val) {
      return val.merchant_id_expire_long === 'Y' ? '长期有效' : val.merchant_id_expire ? util.dateFormat(parseInt(val.merchant_id_expire), 'yyyy-MM-dd hh:mm:ss') : ''
    },
    formatDatesettle_id_expire (val) {
      return val.settle_id_expire_long === 'Y' ? '长期有效' : val.settle_id_expire ? util.dateFormat(parseInt(val.settle_id_expire), 'yyyy-MM-dd hh:mm:ss') : ''
    },
    formatDateperson_id_no(val){
      return val.person_id_expire_long === 'Y' ? '长期有效' : val.person_id_expire ? util.dateFormat(parseInt(val.person_id_expire), 'yyyy-MM-dd hh:mm:ss') : '' 
    },
    formatDatecontro_id_expire(val){
      return val.contro_id_expire_long === 'Y' ? '长期有效' : val.contro_id_expire ? util.dateFormat(parseInt(val.contro_id_expire), 'yyyy-MM-dd hh:mm:ss') : '' 
    },
    networkingOpen(formName){
      this.dialogFormVisibleNetworking = true
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    phonePowerOpen(formName){
      this.dialogFormVisiblePhonePower = true
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    fourElementsOpen(formName){
      this.dialogFormVisibleFourElements = true
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
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
              this.dialogFormVisibleNetworking = false
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
              this.$message({
                type: 'success',
                message: res.message
              });
              this.dialogFormVisiblePhonePower = false
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
              this.$message({
                type: 'success',
                message: res.message
              });
              this.dialogFormVisibleFourElements = false
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
    synchronousPay(index, row) {
        this.$confirm('此操作将同步支付信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            id: row.id,
            shop_id: row.shop_id,
            wx_open: row.wx_open,
            ali_open: row.ali_open
          }
          openWxAli(para).then(res => {
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
    },
    handleRefund (index, row) {
      this.dialogRefundVisible = true
      this.id = row.id
      this.shop_id = row.shop_id
    },
    downImages() {
      let url = this.downloadAgentImages
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        console.log('ie');
        return this.$message({
          message: '请使用非IE浏览器下载，如谷歌，360极速模式等',
          type: 'warning'
        })
      }
      
      window.open(url)
    },
    submitRefund (formName, data) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let para = {
            id: this.id,
            shop_id: this.shop_id,
            merchant_status: data,
            error_msg: this.formDialog.error_msg
          }
          changeStatus(para).then(res => {
            this.dialogDetailVisible = false
            this.getUsers()
            this.$refs[formName].resetFields()
            this.$message({
              message: '审核完成',
              type: 'success'
            })
          })
        }
      })
    },
    getList () {
      let para = this.filters
      para.pageNum = this.page
      this.listLoading = true
      changeAgentMerEnter(para).then(res => {
        this.listLoading = false
        this.users = res.data.shopList
        this.total = res.data.totalCount
      })
    },
    getRepeatRemind () {
      let para = {
        contro_id_no: this.formDetail.contro_id_no,
        person_id_no: this.formDetail.person_id_no,
        merchant_id_no: this.formDetail.merchant_id_no,
        merchant_address: this.formDetail.merchant_address
      }
      repeatRemind(para).then(res => {
        this.controCount = res.data.controCount
        this.personCount = res.data.personCount
        this.cardCount = res.data.cardCount
        this.addressCount = res.data.addressCount
      })
    },
    getListDetail (change, val) {
      ChangeAgentShop({ id: change, shop_id: val }).then(res => {
        this.formDetail = res.data.changeAgentShop 
        this.bsbPay = res.data.bsbPay
        this.$nextTick(() => {
          this.getRepeatRemind()
        })
      })
    },
    handleDetail (index, row) {
      this.dialogDetailVisible = true
      this.id = row.id
      this.shop_id = row.shop_id
      this.getListDetail(row.id, row.shop_id)
      this.downloadAgentImages = `${downloadAgentImages}?id=${row.id}&shop_id=${row.shop_id}&filename=${row.merchant_name}&agent_id=${row.agent_id}`
    }
  }
}
</script>
