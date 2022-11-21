import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/Layout'
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Layout',
            component: Layout,
            redirect: '/',
            children: [
                {
                    path: '/',
                    name: 'Home',
                    component: () => import('@/views/Home')
                },
                {
                    path: '/source',
                    name: 'Source',
                    component: () => import('@/views/Source')
                },
                {
                    path: '/chunk',
                    name: 'chunk',
                    component: () => import('@/views/Chunk')
                }
            ]
        }
    ]
})

export default router
