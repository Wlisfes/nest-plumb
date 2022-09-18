import Vue from 'vue'
import ElementUI from 'element-ui'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import '@/style/index.less'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
