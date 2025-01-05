<template>
  <div class="register-container">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        label-width="auto"
        status-icon
        style="max-width: 600px"
    >
      <h3 class="register_title">
        系统注册
        <el-button style="background: #8fffec" @click="toLogin()">去登录</el-button>
      </h3>

      <el-form-item prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off" placeholder="姓名" type="text">
          <template #prefix>
            <el-icon>
              <User/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="email">
        <el-input v-model="ruleForm.email" autocomplete="off" placeholder="邮箱" type="text">
          <template #prefix>
            <el-icon>
              <Message/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="phoneNumber">
        <el-input v-model="ruleForm.phoneNumber" autocomplete="off" placeholder="手机号" type="text">
          <template #prefix>
            <el-icon>
              <Iphone/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="idNumber">
        <el-input v-model="ruleForm.idNumber" autocomplete="off" placeholder="身份证号码" type="text">
          <template #prefix>
            <el-icon>
              <CreditCard/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="ruleForm.password" autocomplete="off" placeholder="密码" type="password">
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="checkPass">
        <el-input
            v-model="ruleForm.checkPass"
            autocomplete="off"
            placeholder="确认密码"
            type="password"
        >
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {ElNotification, FormInstance, FormRules} from 'element-plus';
import {useRouter} from 'vue-router';
import {CreditCard, Iphone, Lock, Message, User} from '@element-plus/icons-vue';
import {NewRequest} from '@/utils/request';


const router = useRouter();

const toLogin = () => {
  router.push('/');
};

const ruleFormRef = ref<FormInstance>();

const validateName = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入姓名'));
  } else if (!/^[\u4e00-\u9fa5]{2,4}$/.test(value)) {
    callback(new Error('姓名必须为2到4个中文字符'));
  } else {
    callback();
  }
};

const validateEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入邮箱'));
  } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)) {
    callback(new Error('邮箱格式不正确'));
  } else {
    callback();
  }
};

const validatePhoneNumber = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入手机号'));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('手机号格式不正确'));
  } else {
    callback();
  }
};

const validateIDNumber = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入身份证号码'));
  } else if (!validateIDCard(value)) {
    callback(new Error('身份证号码格式不正确'));
  } else {
    callback();
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField('checkPass');
    }
    callback();
  }
};

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== ruleForm.password) {
    callback(new Error('两次密码不匹配'));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  name: '',
  email: '',
  phoneNumber: '',
  idNumber: '',
  password: '',
  checkPass: '',
});

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [{validator: validateName, trigger: 'blur'}],
  email: [{validator: validateEmail, trigger: 'blur'}],
  phoneNumber: [{validator: validatePhoneNumber, trigger: 'blur'}],
  idNumber: [{validator: validateIDNumber, trigger: 'blur'}],
  password: [{validator: validatePass, trigger: 'blur'}],
  checkPass: [{validator: validatePass2, trigger: 'blur'}],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const jsonData = {}
  formEl.validate((valid) => {
    if (valid) {
      const jsonData = {
        name: ruleForm.name,
        phoneNumber: ruleForm.phoneNumber,
        idNumber: ruleForm.idNumber,
        password: ruleForm.password,
        email: ruleForm.email,
      };
      // submitDataToServer(jsonData);
      try {
        NewRequest('post', '/api/auth/register', jsonData).then((response) => {
          if (response.data.code !== '0') {
            ElNotification({
              title: '注册失败',
              message: `注册失败失败：${response.data.message || '未知错误'}`,
              type: 'error',
            });
          } else {
            // 正常
            ElNotification({
              title: '成功',
              message: '注册成功！',
              type: 'success',
            });
            router.push("/");
          }
        })
      } catch (error) {
        console.error('提交数据时出错:', error);
        throw error; // 可以选择抛出错误或者在这里处理
      }
      console.log('提交成功', ruleForm);
    } else {
      console.log('提交失败');
    }
  });
};

const submitDataToServer = (data: any) => {
  try {
    NewRequest('post', '/api/auth/register', data).then((response) => {
      if (response.data.data.code !== '0') {
        ElNotification({
          title: '注册失败',
          message: `注册失败失败：${response.data.message || '未知错误'}`,
          type: 'error',
        });
      } else {
        // 正常
        ElNotification({
          title: '成功',
          message: '注册成功！',
          type: 'success',
        });
      }
    })
  } catch (error) {
    console.error('提交数据时出错:', error);
    throw error; // 可以选择抛出错误或者在这里处理
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 身份证号码校验函数
function validateIDCard(idCard) {
  if (idCard.length !== 18) {
    return false;
  }
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  const idCardBase = idCard.substr(0, 17);
  if (!/^\d{17}$/.test(idCardBase)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCardBase.charAt(i)) * weights[i];
  }
  const remainder = sum % 11;
  const expectedCode = checkCodes[remainder];
  const inputCode = idCard.substr(17).toUpperCase();
  return inputCode === expectedCode;
}

// async function clickRegister() {
//   const fromData = {
//     name: ruleForm.name,
//     email: ruleForm.email,
//     phoneNumber: ruleForm.phoneNumber,
//     password: ruleForm.pass,
//     idNumber: Number(ruleForm.idNumber),
//   }
//   const response = await request('post', '/api/auth/register', fromData);
//   // 发送请求后，对请求进行处理
//   console.log(response);
// }


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

.register-container {
  border-radius: 15px;
  background-clip: padding-box;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.register_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>
