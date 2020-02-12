// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {fetch,post,post_form} from "./utils/http";
import LazyLoad from './lazyload';
if (!Array.prototype.remove){
	Array.prototype.remove = function (item) {
		if (!this.length) return;
		let index = this.indexOf(item);
		if (index > -1) {
			this.splice(index,1);
			return this;
		}
	}
}
if (!Array.prototype.pushIfNew){
	Array.prototype.pushIfNew = function (...item) {
		for (let i of item)
			if (this.indexOf(i)===-1)
				this.push(i);
		return this
	}
}

Vue.use(LazyLoad);
Vue.config.productionTip = false;
Vue.use(mavonEditor);
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
});
