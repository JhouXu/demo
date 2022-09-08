import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app')
