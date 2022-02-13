import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Vuetify from "vuetify";

Vue.config.productionTip = false
Vue.use(Vuetify);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
export default new Vuetify({
  icons: {
    iconfont: "mdiSvg,   ,mdiSvg, md, fa, fa4, faSvg",
  },
});
