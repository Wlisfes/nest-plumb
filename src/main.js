import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import Contextmenu from 'vue-contextmenujs'
import ClickOutside from 'vue-click-outside'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/index.less'

Vue.use(ElementUI)
Vue.use(Contextmenu)
Vue.directive('click-outside', ClickOutside)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
