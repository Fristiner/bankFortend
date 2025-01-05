<template>
  <div class="transfer-container" style="width: 1200px;">
    <el-card class="transfer-card">
      <template #header>
        <el-button @click="goBack">返回</el-button>
        <div class="card-header">
          <span>转账</span>
        </div>
      </template>

      <!-- 表单 -->
      <el-form ref="transferFormRef" :model="transferForm" :rules="rules" label-width="120px">
        <!-- 收款人账号 -->
        <el-form-item label="收款人账号" prop="receiverAccount">
          <el-input v-model="transferForm.receiverAccount" placeholder="请输入收款人账号"/>
        </el-form-item>

        <!-- 转账金额 -->
        <el-form-item label="转账金额" prop="amount">
          <el-input v-model="transferForm.amount" placeholder="请输入转账金额" type="number"/>
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注" prop="remark">
          <el-input
              v-model="transferForm.remark"
              :rows="3"
              placeholder="请输入备注"
              type="textarea"
          />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {ElMessage, ElNotification} from 'element-plus';
import {NewRequest} from "@/utils/request.js";

// 表单数据
const transferForm = ref({
  receiverAccount: '', // 收款人账号
  amount: '', // 转账金额
  remark: '', // 备注
});
const goBack = () => {
  window.history.back();
};
// 表单验证规则
const rules = {
  receiverAccount: [
    {required: true, message: '请输入收款人账号', trigger: 'blur'},
    {min: 10, max: 20, message: '账号长度应为 10 到 20 位', trigger: 'blur'},
  ],
  amount: [
    {required: true, message: '请输入转账金额', trigger: 'blur'},
    {type: 'number', message: '金额必须为数字', trigger: 'blur', transform: (value) => Number(value)},
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('金额必须大于 0'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    },
  ],
  remark: [
    {max: 100, message: '备注不能超过 100 个字符', trigger: 'blur'},
  ],
};

// 表单引用
const transferFormRef = ref(null);

// 提交表单
const submitForm = () => {
  const jsonData = {
    targetIdNumber: transferForm.value.receiverAccount,
    amount: transferForm.value.amount,
    remark: transferForm.value.remark,
  };

  transferFormRef.value.validate((valid) => {
    if (valid) {
      NewRequest('post', "/api/account/transfer", jsonData).then((response) => {
        // console.log("验证码为： " + verificationCode)
        if (response.data.code !== '0') {
          ElNotification({
            title: '失败',
            message: `转账失败：${response.data.message || '未知错误'}`,
            type: 'error',
          });
        } else {
          ElNotification({
            title: '成功',
            message: '转账成功',
            type: 'success',
          });
          // 一秒后执行返回上一级
          
          window.history.back();

        }
      }).catch((error) => {
        ElNotification({
          title: '失败',
          message: `查询交易信息错误：${error.message || '未知错误'}`,
          type: 'error',
        });
        console.error(error);
      })


    } else {
      ElMessage.error('请检查表单输入');
    }
  });
};

// 重置表单
const resetForm = () => {
  transferFormRef.value.resetFields();
};
</script>

<style scoped>
.transfer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.transfer-card {
  width: 500px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

</style>
