// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {fetch,post,post_form} from "./utils/http";

Vue.config.productionTip = false;
Vue.use(mavonEditor);
Vue.prototype.baseURL = process.env.API_ROOT;
Vue.prototype.$fetch = fetch;
Vue.prototype.$post = post;
Vue.prototype.$post_form = post_form;
router.beforeEach((to,from,next)=>{
	if (to.meta.title)
		document.title = to.meta.title;
	next();
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
	store,
  components: { App },
  template: '<App/>'
})
