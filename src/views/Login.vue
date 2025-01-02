<template>
  <div id="poster">
    <el-form ref="form" class="login-container" label-position="left" label-width="0px">
      <h3 class="login_title">
        系统登录
        <el-button style="background: #8fffec" @click="toRegister">注册</el-button>
      </h3>
      <el-form-item>
        <el-input v-model="loginForm.loginName" autocomplete="off" placeholder="账号" type="text"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="loginForm.password" autocomplete="off" placeholder="密码" type="password"/>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button style="width: 100%; background: #505458; border: none;" type="primary" @click="login">登录
        </el-button>
      </el-form-item>
    </el-form>
    <!--    <el-button plain @click="open1">Success</el-button>-->
  </div>
</template>

<script setup>
// import router from '@/router';
import {reactive} from 'vue'
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";


const router = useRouter();

const loginForm = reactive({
  loginName: '',
  password: '',
});

const open1 = () => {
  ElMessage({
    message: '登录成功',
    type: 'success',
    plain: true,
  })
}
const onSubmit = () => {
  console.log('submit!')
}
//
// const router = useRouter();
const toRegister = () => {

  router.push({path: 'register'});
}

const login = () => {
  this.axios.post('http://127.0.0.1:8080/login',)
  console.log('账号', loginForm.loginName, ' 密码：', loginForm.password);
  open1();
}

</script>


<style>


#poster {
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center;
  height: 100vh;
  width: 100%;
  background-size: cover;
  position: relative;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>
