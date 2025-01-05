<script setup>
import {ref} from 'vue';
import {ElNotification} from "element-plus";
import {NewRequest} from "@/utils/request.js";
import router from "@/router/index.js"; // 确保正确导入 ElNotification
// import NewRequest from '@/utils/NewRequest'; // 假设 NewRequest 是从这个路径导入的

// 使用 ref 创建响应式数据
const showTransfer = ref(false);
const showRecharge = ref(false);
const transferStudentId = ref('');
const transferAmount = ref('');
const rechargeStudentId = ref('');
const rechargeAmount = ref('');

// const balance = ref('');

// 定义方法
const toggleTransfer = () => {
  // showTransfer.value = !showTransfer.value;
  router.push("/bank/transfer");
};

const toggleRecharge = () => {
  showRecharge.value = !showRecharge.value;
};

// 使用 ref 创建响应式数据
const balance = ref(''); // 初始化为空字符串或其他默认值
const changeToBalance = () => {
  router.push("/bank/balance")
}

// 定义方法
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
      // 注意这里假设返回的数据结构是 { data: { balance: "100.00" } }
      const balance1 = response.data.data.balance;
      balance.value = balance1; // 直接赋值，而不是 balance1.value
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

const performRecharge = async () => {
  // transferAmount
  const dataJson = {
    amount: rechargeAmount.value,
  }
  console.log("dataJson = " + dataJson.amount);
  try {

    const response = await NewRequest("post", "/api/account/deposit", dataJson);

    if (response.data.code !== '0') {
      ElNotification({
        title: '失败',
        message: `充值金额失败：${response.data.message || '未知错误'}`,
        type: 'error',
      });
    } else {
      ElNotification({
        title: '成功',
        message: '充值金额成功！',
        type: 'success',
      });
    }
  } catch (error) {
    ElNotification({
      title: '失败',
      message: `充值金额时发生错误：${error.message || '未知错误'}`,
      type: 'error',
    });
    console.error(error);
  }
}

const viewTransactions = () => {
  router.push("/bank/record");
}


// export default {
//   name: 'BankInterface',
//   data() {
//     return {
//       showTransfer: false,
//       showRecharge: false,
//       transferStudentId: '',
//       transferAmount: '',
//       rechargeStudentId: '',
//       rechargeAmount: ''
//     };
//   },
//   methods: {
//
//     toggleTransfer() {
//       this.showTransfer = !this.showTransfer;
//     },
//     toggleRecharge() {
//       this.showRecharge = !this.showRecharge;
//     }
//   }
// }


</script>


<template>
  <div class="bank-interface">
    <!--    <h1>&nbsp;&nbsp;&nbsp;&nbsp;Student&nbsp;&nbsp;&nbsp;</h1>-->
    <div class="buttons">
      <!--      <button class="large-button" @click="checkBalance()">查询余额</button>-->
      <button class="large-button" @click="changeToBalance">查询余额跳转</button>
      <button class="large-button" @click="checkBalance">查询余额</button>


      <p>当前余额: {{ balance }}</p>
      <button class="large-button" @click="viewTransactions">交易记录</button>
      <!--      <el-button class="large-button" type="primary" @click="checkBalance> sd</el-button>-->
      <!-- 转账功能 -->

      <div class="transaction-section">
        <button class="large-button" @click="toggleTransfer">转账</button>
        <!--        <div v-if="showTransfer" class="input-fields">-->
        <!--          &lt;!&ndash;          <input v-model="transferStudentId" placeholder="输入学号" type="text"/>&ndash;&gt;-->
        <!--          <input v-model="transferAmount" placeholder="输入转账金额" type="number"/>-->
        <!--          <button class="confirm-button" @click="performTransfer">确认转账</button>-->
        <!--        </div>-->
      </div>

      <!-- 充值功能 -->
      <div class="transaction-section">
        <button class="large-button" @click="toggleRecharge">充值</button>
        <div v-if="showRecharge" class="input-fields">
          <!--          <input v-model="rechargeStudentId" placeholder="输入学号" type="text"/>-->
          <input v-model="rechargeAmount" placeholder="输入充值金额" type="number"/>
          <button class="confirm-button" @click="performRecharge">确认充值</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bank-interface {
  max-width: 400px;
  margin: 0 auto; /* 居中显示 */
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 设置按钮之间的间距 */
}

.large-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%; /* 使按钮宽度占满 */
  box-sizing: border-box; /* 确保按钮宽度计算包含内边距和边框 */
}

.large-button:hover {
  background-color: #0056b3;
}


.input-fields {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

input {
  padding: 8px;
  font-size: 14px;
  width: calc(100% - 16px);
  border: 1px solid #ccc;
  border-radius: 4px;
}

.confirm-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #28a745; /* 绿色按钮 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%; /* 确保确认按钮宽度占满 */
  box-sizing: border-box; /* 确保按钮宽度计算包含内边距和边框 */
}

.confirm-button:hover {
  background-color: #218838;
}
</style>
