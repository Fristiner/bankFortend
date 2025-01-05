<template>
  <div class="container">
    <div class="header">
      <el-button @click="goBack">返回</el-button>
      <!--      <h1>银行账户余额查询</h1>-->
    </div>
    <!--    <el-input-->
    <!--        v-model="cardNumber"-->
    <!--        :disabled="loading"-->
    <!--        clearable-->
    <!--        placeholder="请输入银行卡号"-->
    <!--        @input="validateCardNumber"-->
    <!--    >-->
    <!--      <template #prefix>-->
    <!--        <i class="el-icon-user"></i>-->
    <!--      </template>-->
    <!--    </el-input>-->
    <!--    <el-button-->
    <!--        :disabled="!isValidCardNumber"-->
    <!--        :loading="loading"-->
    <!--        style="margin-top: 20px;"-->
    <!--        type="primary"-->
    <!--        @click="queryBalance"-->
    <!--    >-->
    <!--      查询余额-->
    <!--    </el-button>-->
    <div v-if="balance !== null" class="balance">
      
      <h2>当前你的账户余额为:</h2>
      <p>{{ balance }} 元</p>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ElNotification} from 'element-plus';
import {NewRequest} from '@/utils/request'; // 根据实际路径调整

const cardNumber = ref('');
const balance = ref(null);
const loading = ref(false);
const isValidCardNumber = ref(false);

const goBack = () => {
  window.history.back();
};

const validateCardNumber = () => {
  // 简单校验：卡号为16位数字
  isValidCardNumber.value = /^\d{16}$/.test(cardNumber.value);
};

const queryBalance = async () => {
  if (!isValidCardNumber.value) return;

  loading.value = true;
  balance.value = null;

  try {
    // 模拟API请求
    const response = await new Promise((resolve) => {
      setTimeout(() => resolve({data: {balance: 10000.00}}), 1000);
    });

    balance.value = response.data.balance.toFixed(2);
    ElNotification({
      title: '成功',
      message: '查询成功！',
      type: 'success',
    });
  } catch (error) {
    ElNotification({
      title: '失败',
      message: '查询失败，请稍后再试。',
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
};

const checkBalance = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log(token);
    console.log(localStorage.getItem('email'));
    const response = await NewRequest("get", "/api/account/balance");

    if (response.data.code !== '0') {
      ElNotification({
        title: '失败',
        message: `查询余额失败：${response.data.message || '未知错误'}`,
        type: 'error',
      });
    } else {
      // 假设返回的数据结构是 { data: { balance: "100.00" } }
      const balance1 = response.data.data.balance;
      balance.value = balance1; // 直接赋值
      ElNotification({
        title: '成功',
        message: '余额查询成功！',
        type: 'success',
      });
    }
  } catch (error) {
    ElNotification({
      title: '失败',
      message: `查询余额时发生错误：${error.message || '未知错误'}`,
      type: 'error',
    });
    console.error(error);
  }
};

onMounted(() => {
  checkBalance();
});
</script>
<style>
.container {
  width: 400px;
  margin: 50px auto;
  text-align: center;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header .el-button {
  margin-right: auto; /* Pushes the button to the left */
}

.balance {
  margin-top: 50px;
}

.balance h2 {
  color: #303133;
}

.balance p {
  font-size: 24px;
  color: #67c23a;
}
</style>
