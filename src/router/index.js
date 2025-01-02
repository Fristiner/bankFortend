import {createRouter, createWebHashHistory} from 'vue-router'
import login from '../views/Login.vue'
import register from '../views/Register.vue'
import {ElMessage} from "element-plus";


const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Login',
            component: login,
        },
        {
            path: '/register',
            name: 'register',
            component: register,
        },
        {
            path: '/student',
            name: 'student',
            component: () => import('../student/index.vue'),
        },

        // {
        //   path: '/',
        //   name: 'home',
        //   component: HomeView,
        // },

        // {
        //   path: '/about',
        //   name: 'about',
        //   // route level code-splitting
        //   // this generates a separate chunk (About.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import('../views/AboutView.vue'),
        // },
    ],
})
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth) {
        if (token) {
            next();
        } else {
            ElMessage.warning('请先登录');
            next('/login');
        }
    } else {
        next();
    }
});


export default router
