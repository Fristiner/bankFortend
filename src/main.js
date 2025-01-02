import './assets/main.css'

import axios  from 'axios'
import VueAxios  from 'vue-axios'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(VueAxios, axios)
app.use(router)
app.use(ElementPlus)

app.mount('#app')


// main.ts

