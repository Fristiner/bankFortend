import {createRouter, createWebHashHistory} from 'vue-router';
import login from '../views/Login.vue';
import register from '../views/Register.vue';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login', // 将根路径重定向到登录页
        },
        {
            path: '/login',
            name: 'Login',
            component: login,
        },
        {
            path: '/register',
            name: 'Register',
            component: register,
        },
        {
            path: '/bank',
            name: 'Student',
            component: () => import('@/bank/bank.vue'),
            meta: {requiresAuth: true},
        },
        {
            path: '/test',
            name: 'Test',
            component: () => import('../views/test.vue'),
            meta: {requiresAuth: true},
        },
        {
            path: '/bank/balance',
            name: 'Balance',
            component: () => import('../bank/balance.vue'),
            meta: {requiresAuth: true},
        },
        {
            path: '/bank/record',
            name: 'record',
            component: () => import('../bank/TransactionRecord.vue'),
            meta: {requiresAuth: true},
        },
        {
            path: '/bank/transfer',
            name: 'transfer',
            component: () => import('../bank/transfer.vue'),
            meta: {requiresAuth: true},
        },
        {
            path: '/:pathMatch(.*)*', // 捕获所有未定义的路径
            name: 'NotFound',
            component: () => import('../views/NotFound.vue'),
            meta: {requiresAuth: true},
            // 404页面
        },
    ],
});

// 路由守卫
// to.meta.requiresAuth = undefined;
// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem('token');
//     const requiresAuth = to.meta.requiresAuth;
//
//     if (requiresAuth && !token) {
//         ElMessage.warning('请先登录');
//         next('/login');
//     } else {
//         next();
//     }
// });


router.beforeEach((to, from, next) => {
    /**
     * 未登录则跳转到登录页
     * 未登录跳转到登录页,也可以通过axios的响应拦截器去实现,但是会先在当前页面渲染一下,再跳转到登录页,会有个闪动的现象
     * 这里通过路由守卫的方式,不会在当前页闪现一下,但是需要在每个路由组件添加一个是否需要登录的标识位,如本项目中的requireAuth字段
     */
    if (to.matched.some((auth) => auth.meta.requireAuth)) {
        let token = localStorage.getItem("token");
        if (token) {
            next();
        } else {
            next({
                path: "/login"
            });
        }
    } else {
        next();
    }
})

export default router;
