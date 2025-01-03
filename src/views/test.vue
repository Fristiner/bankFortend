<template>
  <div id="app" class="container">
    <!-- 发送验证码按钮 -->
    <el-button :type="buttonType" @click="sendVerificationCode">{{ buttonLabel }}</el-button>

    <!-- 验证码输入框 -->
    <el-input v-model="verificationCode" placeholder="请输入验证码" style="margin-top: 20px;"/>

    <!-- 提交按钮 -->
    <el-button :disabled="!isCodeSent || !verificationCode" style="margin-top: 20px;" type="primary"
               @click="submitCode">
      提交验证码
    </el-button>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {ElNotification} from 'element-plus';

// 控制按钮的颜色和文字
const buttonType = ref('primary');
const buttonLabel = ref('发送验证码');

// 验证码输入框绑定的值
const verificationCode = ref('');

// 标记验证码是否已发送
const isCodeSent = ref(false);

// 模拟发送验证码
const sendVerificationCode = () => {
  // 这里可以加入实际发送验证码的逻辑
  // 比如调用API接口等

  // 模拟发送成功后的处理
  setTimeout(() => {
    ElNotification({
      title: '成功',
      message: '验证码已发送，请查收！',
      type: 'success',
    });
    buttonType.value = 'success'; // 改变按钮颜色
    buttonLabel.value = '验证码已发送';
    isCodeSent.value = true; // 允许提交
  }, 1000); // 模拟网络延迟
};

// 提交验证码
const submitCode = () => {
  // 这里可以加入实际提交验证码的逻辑
  // 比如验证输入的验证码是否正确等

  // 模拟提交成功的处理
  setTimeout(() => {
    ElNotification({
      title: '成功',
      message: '验证码验证通过！',
      type: 'success',
    });
    // 重置表单
    resetForm();
  }, 1000); // 模拟网络延迟
};

// 重置表单
const resetForm = () => {
  buttonType.value = 'primary';
  buttonLabel.value = '发送验证码';
  isCodeSent.value = false;
  verificationCode.value = '';
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

/* 添加额外的样式以确保界面美观 */
.el-button {
  width: 100%;
}
</style>
