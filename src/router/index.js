import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/Home')
        },
        {
            path: '/core',
            name: 'Core',
            component: () => import('@/views/core/Core')
        }
    ]
})

export default router
