// src/utils/request.js
import axios from 'axios';
import {ElMessage} from "element-plus";
import router from "@/router/index.js";

// 创建 axios 实例
const service = axios.create({
    baseURL: 'http://127.0.0.1:8080', // 后端 API 基础地址
    timeout: 5000, // 请求超时时间

});

// 请求拦截器
service.interceptors.request.use(
    (config) => {

        config.headers = {
            'Content-Type': 'application/json',
        }

        // 从 localStorage 中获取 token
        const token = localStorage.getItem('token');
        if (token) {
            // 如果 token 存在，将其添加到请求头中
            config.headers['Authentication'] = token;
        }

        return config;
    },
    (error) => {
        // 请求错误处理
        return Promise.reject(error);
    }
);
//
// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据进行处理
        const {data} = response;
        if (data.code === 200) {
            // 如果响应成功，直接返回数据
            return data;
        } else {
            // 如果响应失败，显示错误信息
            ElMessage.error(data.message || '请求失败');
            return Promise.reject(data);
        }
    },
    (error) => {
        // 对响应错误进行处理
        if (error.response) {
            const {status} = error.response;
            if (status === 401) {
                // 未授权，跳转到登录页面
                ElMessage.error('登录状态已过期，请重新登录');
                router.push('/login');
            } else if (status === 403) {
                ElMessage.error('权限不足，无法访问');
            } else if (status === 500) {
                ElMessage.error('服务器内部错误');
            } else {
                ElMessage.error(`请求错误 ${status}: ${error.message}`);
            }
        } else {
            ElMessage.error('网络连接失败，请检查网络');
        }
        return Promise.reject(error);
    }
);

export const NewRequest = (method, url, data = null) => {
    method = method.toLowerCase(); // 强制转换为小写
    return service({
        url: url,
        method: method, // 强制转换为小写
        [method === 'GET' ? 'params' : 'data']: data,
    });
};

export const request = (method, url, data = null) => {
    method = method.toLowerCase(); // 强制转换为小写
    return service({
        url: url,
        method: method, // 强制转换为小写
        [method === 'GET' ? 'params' : 'data']: data,
    });
};


// 导出封装的 axios 实例
export default service;
