import router from './router'
import store from './store'
import createRoutes from '@/utils/createRoutes'
import { getDocumentTitle, resetTokenAndClearUser } from './utils'

import {baseURL} from '@/common/js/ipconfig';
import instance from '@/common/js/http';

// 是否有菜单数据
let hasMenus = false
router.beforeEach( async(to, from, next) => {
    document.title = getDocumentTitle(to.meta.title)
    if (localStorage.getItem('fancysmsToken')) {
            if (to.path === '/login') {
                next({ path: '/' })
            } else if (hasMenus) {
                next()
            } else {
                try {
                    // 这里可以用 await 配合请求后台数据来生成路由
                    // const data = await axios.get('xxx')
                    // const routes = createRoutes(data)
                    /////////
                    //const data = await instance.post(`${baseURL.ip1}/sms/getAppsList`)
                    const data={
                        status:0
                    }
                    if(data.status==0){
     
                        const menuArr= [
                            {
                                text: '注册码',
                                children: [
                                    {
                                        name: 'getCode',
                                        text: '注册码获取',
                                    },
                                    {
                                        name: 'payRecord',
                                        text: '消费记录',
                                    },
                                    // {
                                    //     name: 'rechargeList',
                                    //     text: '充值记录',
                                    // },
                                ],
                            },
                            {
                                text: '用户管理',
                                children: [
                                    {
                                        name: 'modifyPassword',
                                        text: '修改密码',
                                    }
                                ],
                            }
                            // {
                            //     text: '客户信息',
                            //     children: [
                            //         {
                            //             name: 'customerList',
                            //             text: '客户信息查询(FR)',
                            //         },
                            //         {
                            //             name: 'userList',
                            //             text: '用户列表',
                            //         },
                                    
                            //     ],
                            // }
                            
                        ];

                        menuArr.forEach((item)=>{
                            item.icon="el-icon-s-grid"
                            // switch (item.text){
                            //     case "注册码":
                            //         item.icon="el-icon-s-grid"
                            //         break;
                            //     case "客户信息":
                            //         item.icon="el-icon-s-grid"
                            //         break;
                            // }
                        })
                        store.commit("setMenus",menuArr)
                        const routes = createRoutes(menuArr)
                        router.addRoutes(routes)
                        hasMenus = true
                        next({ path: to.path || '/' })
                    }
                    // const arr= menuArr
                    // store.commit("setMenus",arr)
                    // const routes = createRoutes(arr)
                    // router.addRoutes(routes)
                    // hasMenus = true
                    // next({ path: to.path || '/' })

                    
                } catch (error) {
                    resetTokenAndClearUser()
                    next(`/login?redirect=${to.path}`)
                }
            }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
})