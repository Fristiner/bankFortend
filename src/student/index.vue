<template>
  <div class="bank-interface">
    <h1>&nbsp;&nbsp;&nbsp;&nbsp;Student&nbsp;&nbsp;&nbsp;</h1>
    <div class="buttons">
      <button class="large-button" @click="checkBalance">查询余额</button>
      <button class="large-button" @click="viewTransactions">交易记录</button>

      <!-- 转账功能 -->
      <div class="transaction-section">
        <button class="large-button" @click="toggleTransfer">转账</button>
        <div v-if="showTransfer" class="input-fields">
          <input type="text" v-model="transferStudentId" placeholder="输入学号" />
          <input type="number" v-model="transferAmount" placeholder="输入转账金额" />
          <button class="confirm-button" @click="performTransfer">确认转账</button>
        </div>
      </div>

      <!-- 充值功能 -->
      <div class="transaction-section">
        <button class="large-button" @click="toggleRecharge">充值</button>
        <div v-if="showRecharge" class="input-fields">
          <input type="text" v-model="rechargeStudentId" placeholder="输入学号" />
          <input type="number" v-model="rechargeAmount" placeholder="输入充值金额" />
          <button class="confirm-button" @click="performRecharge">确认充值</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BankInterface',
  data() {
    return {
      showTransfer: false,
      showRecharge: false,
      transferStudentId: '',
      transferAmount: '',
      rechargeStudentId: '',
      rechargeAmount: ''
    };
  },
  methods: {
  
    toggleTransfer() {
      this.showTransfer = !this.showTransfer;
    },
    toggleRecharge() {
      this.showRecharge = !this.showRecharge;
    }
  }
}
</script>

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
