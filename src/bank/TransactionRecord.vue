<template>
  <div class="header">
    <el-button @click="goBack">返回</el-button>
    <!--      <h1>银行账户余额查询</h1>-->
  </div>
  <el-table :data="tableData" border style="width: 1200px;">
    <el-table-column label="操作人姓名" prop="operatorName" width="200"/>
    <el-table-column label="交易金额" prop="operatorAmount" width="200"/>
    <el-table-column label="交易类型" prop="operatorType" width="200"/>
    <el-table-column label="交易后余额" prop="operatorChangedAmount" width="200"/>
    <el-table-column label="交易时间" prop="operatorTime" width="200"/>
    <el-table-column label="备注" prop="operatorRemark" width="200"/>
  </el-table>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {NewRequest} from "@/utils/request.js";
import {ElNotification} from "element-plus";

// 定义 tableData
const tableData = ref([]);
const goBack = () => {
  window.history.back();
};
// 在组件挂载后获取数据
onMounted(() => {
  NewRequest('get', "/api/transaction/logs").then((response) => {
    // console.log("验证码为： " + verificationCode)
    if (response.data.code !== '0') {
      ElNotification({
        title: '失败',
        message: `查询交易信息失败：${response.data.message || '未知错误'}`,
        type: 'error',
      });
    } else {
      tableData.value = response.data.data;
      ElNotification({
        title: '成功',
        message: '查询交易信息成功',
        type: 'success',
      });
    }
  }).catch((error) => {
    ElNotification({
      title: '失败',
      message: `查询交易信息错误：${error.message || '未知错误'}`,
      type: 'error',
    });
    console.error(error);
  })
})
</script>
<style scoped>
/* 容器样式 */
.container {
  position: relative;
  padding: 20px; /* 为表格和按钮留出间距 */
}

/* 头部按钮样式 */
.header {
  position: absolute; /* 绝对定位 */
  top: 0; /* 距离顶部 0 */
  left: 0; /* 距离左侧 0 */
  z-index: 10; /* 确保按钮在表格上方 */
  padding: 10px; /* 按钮内边距 */
}
</style>
