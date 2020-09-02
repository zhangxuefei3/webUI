import Vue from 'vue'
import VueRouter from 'vue-router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import Routers from './router.js'
import App from './App.vue'
import echarts from 'echarts'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(ViewUI, {
  transfer: false,
  capture: true,
  select: {
    arrow: 'md-arrow-dropdown',
    arrowSize: 20
  }
})
Vue.prototype.$echarts = echarts

const router = new VueRouter({
  mode: 'history',
  routes: Routers
})

const app = new Vue({
  router: router,
  render: h => h(App),
  methods: {
    getApp() {
      return this.$children[0]
    }
  }
}).$mount('#app')

console.log(app)
window.g_app = app.getApp()

// 根据当前选中菜单，更高浏览器标题
function changeTitle(name) {
  if (name) {
    document.title = 'cloud - ' + name
  } else {
    document.title = 'cloud'
  }
}
router.onReady(function() {
  const menu = app.getApp().$refs.topMenu
  const toName = menu.getMenuName(router.currentRoute.path)
  changeTitle(toName)
})
router.afterEach((to) => {
  const menu = app.getApp().$refs.topMenu
  const toName = menu.getMenuName(to.path)
  changeTitle(toName)
})
