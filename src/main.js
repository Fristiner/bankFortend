import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(VueAxios, axios)
app.use(router)
app.use(ElementPlus)

// 默认加载 main.css
import './assets/main.css'

// 监听路由变化，动态切换 CSS
router.afterEach((to) => {
    const head = document.head
    const existingLink = document.getElementById('dynamic-css')

    if (existingLink) {
        head.removeChild(existingLink)  // 移除已有样式
    }

    const newLink = document.createElement('link')
    newLink.id = 'dynamic-css'
    newLink.rel = 'stylesheet'

    // 根据路由切换 CSS 文件
    if (to.path === '/student') {
        newLink.href = '/src/assets/juzhong.css'
    } else {
        newLink.href = '/src/assets/main.css'
    }

    head.appendChild(newLink)
})

app.mount('#app')
