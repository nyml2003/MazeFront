import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import Cookies from 'js-cookie'
import '@/assets/css/global.css'
import 'element-plus/theme-chalk/index.css'
import '@icon-park/vue-next/styles/index.css';
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}

const app=createApp(App)
app.config.globalProperties.$cookies = Cookies
  app.use(ElementPlus).use(store).use(router).mount('#app')