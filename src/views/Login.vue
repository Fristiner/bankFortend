<template>
  <div id="poster">
    <el-form ref="form" class="login-container" label-position="left" label-width="0px">
      <h3 class="login_title">
        系统登录
        <el-button style="background: #8fffec" @click="toRegister">注册</el-button>
      </h3>
      <el-form-item>
        <el-input v-model="loginForm.loginName" autocomplete="off" placeholder="身份证号" type="text"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="loginForm.password" autocomplete="off" placeholder="密码" type="password"/>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button style="width: 100%; background: #505458; border: none;" type="primary" @click="login">登录
        </el-button>
      </el-form-item>

    </el-form>
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal">
        <span class="close-button" @click="toggleModalVisibility">&times;</span>
        <!--        <el-form-item>-->
        <!--          <el-input v-model="verifyLoginData.email" autocomplete="off" placeholder="身份证号" type="text"/>-->
        <!--        </el-form-item>-->
        <!--        <p>验证码将要送发到你的邮箱{{ verifyLoginData.email }}</p>-->
        <!--        <p></p>-->
        <!--        <el-button :type="buttonType" style="margin-top: 20px;" @click="sendVerificationCode">{{-->
        <!--            buttonLabel-->
        <!--          }}-->
        <!--        </el-button>-->
        <!-- 验证码提示信息和发送验证码按钮在同一行 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="14">
            <p>验证码将要发送到你的邮箱 {{ verifyLoginData.email }}</p>
          </el-col>
          <el-col :span="10">

            <el-button :type="buttonType" @click="sendVerificationCode">{{ buttonLabel }}</el-button>
          </el-col>
        </el-row>
        <!-- 验证码输入框 -->
        <!--        <el-input v-model="verificationCode" placeholder="请输入验证码" style="margin-top: 20px;"/>-->

        <!--        &lt;!&ndash; 提交按钮 &ndash;&gt;-->
        <!--        <el-button :disabled="!isCodeSent || !verificationCode" style="margin-top: 20px;" type="primary"-->
        <!--                   @click="submitCode">-->
        <!--          提交验证码-->
        <!--        </el-button>-->

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="14">
            <el-input v-model="verificationCode" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :span="10">
            <el-button :disabled="!isCodeSent || !verificationCode" type="primary" @click="submitCode">
              提交验证码
            </el-button>
          </el-col>
        </el-row>


        <!--        <p>{{ modalInfo }}</p>-->
      </div>
    </div>
  </div>

</template>

<script setup>
// import router from '@/router';
import {nextTick, reactive, ref} from 'vue'
import {useRouter} from "vue-router";
import {ElMessage, ElNotification} from "element-plus";
import {NewRequest} from "@/utils/request.js";

const router = useRouter();

const loginForm = reactive({
  loginName: '',
  password: '',
});

const verifyLoginData = reactive({
  email: '',
  token: '',
})

const openSuccess = () => {
  ElMessage({
    message: '登录成功',
    type: 'success',
    plain: true,
  })
}
const openError = (message) => {
  ElMessage({
    showClose: true,
    message: message,
    type: 'error',
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
  const jsonData = {
    idNumber: loginForm.loginName,
    password: loginForm.password,
  };

  // 发送请求
  NewRequest('post', '/api/auth/verifyLogin', jsonData).then((response) => {
    // 处理成功的响应
    console.log(response);
    const code = response.data.code;
    if (code === 'A0001004') {
      console.log(response.data.message);
      openError(response.data.message);

    }
    if (code === 'A0001005') {
      console.log(response.data.message);
      openError(response.data.message);

    }
    if (code === '0') {
      verifyLoginData.email = response.data.data.email;
      verifyLoginData.token = response.data.data.token;
      toggleModalVisibility();
      // openSuccess();
    }
    if (code === 'A0001006') {
      console.log(response.data.message);
      openError(response.data.message);
    }

    // 根据实际需求进行后续操作
  })
      .catch((error) => {
        // 处理请求错误
        console.error(error);
        // 可以根据错误信息进行相应的提示或处理
      });


}

// 控制模态框显示状态的数据属性
const isModalVisible = ref(false);

// 模态框内的信息
const modalInfo = ref('这里是模态框中要显示的原有信息');

// 切换模态框的显示状态
const toggleModalVisibility = () => {
  isModalVisible.value = !isModalVisible.value;
};

// TODO： 验证码发送

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
  const jsonData = {
    email: verifyLoginData.email,
    token: verifyLoginData.token,
  }
  NewRequest('post', '/api/auth/sendCode', jsonData).then((response) => {
    if (response.data.code !== '0') {
      // 发送失败
      ElNotification({
        title: '失败',
        message: `发送验证码失败：${response.data.message || '未知错误'}`,
        type: 'error',
      });
    } else {
      // 发送成功
      ElNotification({
        title: '成功',
        message: '验证码已发送，请查收！',
        type: 'success',
      });
      buttonType.value = 'success'; // 改变按钮颜色
      buttonLabel.value = '验证码已发送';
      isCodeSent.value = true; // 允许提交
    }
  }).catch((error => {
    // 请求失败（如网络问题等）
    ElNotification({
      title: '失败',
      message: `发送验证码时发生错误：${error.message || '未知错误'}`,
      type: 'error',
    });
    console.error(error);
  }))


  // // 模拟发送成功后的处理
  // setTimeout(() => {
  //   ElNotification({
  //     title: '成功',
  //     message: '验证码已发送，请查收！',
  //     type: 'success',
  //   });
  //   buttonType.value = 'success'; // 改变按钮颜色
  //   buttonLabel.value = '验证码已发送';
  //   isCodeSent.value = true; // 允许提交
  // }, 1000); // 模拟网络延迟
};
const emailCode = ref('');
// 提交验证码
const submitCode = () => {
  // 这里可以加入实际提交验证码的逻辑
  // 比如验证输入的验证码是否正确等
  const jsonData = {
    email: verifyLoginData.email,
    code: verificationCode.value,
  }
  // const jsonString = JSON.stringify(jsonData);

  NewRequest('post', "/api/auth/Login", jsonData).then((response) => {
    console.log("验证码为： " + verificationCode)
    if (response.data.code !== '0') {
      ElNotification({
        title: '失败',
        message: `验证码验证失败：${response.data.message || '未知错误'}`,
        type: 'error',
      });
    } else {
      const token = response.data.data.authorization; // 根据实际API响应调整
      localStorage.setItem('token', token); // 存储令牌
      localStorage.setItem('email', verifyLoginData.email);
      ElNotification({
        title: '成功',
        message: '验证码验证通过！',
        type: 'success',
      });

      // 页面跳转到 /bank
      // router.push({path: '/bank'});
      nextTick(() => {
        router.push({path: '/bank'});
      });
    }
  }).catch((error) => {
    ElNotification({
      title: '失败',
      message: `提交验证码时发生错误：${error.message || '未知错误'}`,
      type: 'error',
    });
    console.error(error);
  });
};

// 重置表单
const resetForm = () => {
  buttonType.value = 'primary';
  buttonLabel.value = '发送验证码';
  isCodeSent.value = false;
  verificationCode.value = '';
};


</script>


<style>
/* 样式使模态框居中并覆盖整个屏幕 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 400px;
  text-align: center;
}

.close-button {
  cursor: pointer;
  font-size: 1.5em;
  position: absolute;
  top: 10px;
  right: 10px;
}

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
