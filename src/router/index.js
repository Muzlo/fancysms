import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: () => import('../components/Login.vue'),
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404' },
        component: () => import('../components/404.vue'),
    },
    { path: '/', redirect: '/getCode' },
    
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
    /////注册码模块
    getCode: {
        path: 'getCode',
        name: 'getCode',
        meta: { title: '注册码获取' },
        component: () => import('../views/codeModule/getCode.vue'),
    },
    payRecord: {
        path: 'payRecord',
        name: 'payRecord',
        meta: { title: '消费记录' },
        component: () => import('../views/codeModule/payRecord.vue'),
    },
    rechargeList: {
        path: 'rechargeList',
        name: 'rechargeList',
        meta: { title: '充值记录' },
        component: () => import('../views/codeModule/rechargeList.vue'),
    },
    customerList: {
        path: 'customerList',
        name: 'customerList',
        meta: { title: '客户信息查询(FR)' },
        component: () => import('../views/customerModule/customerList.vue'),
    },
    userList: {
        path: 'userList',
        name: 'userList',
        meta: { title: '用户列表' },
        component: () => import('../views/userListModule/userList.vue'),
    },
    modifyPassword: {
        path: 'modifyPassword',
        name: 'modifyPassword',
        meta: { title: '修改密码' },
        component: () => import('../views/userManageModule/modifyPassword.vue'),
    },
}

const createRouter = () => new Router({
    // base:'/fancysms/',
    routes: commonRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router