import axios from 'axios';
import qs from 'qs'
import router from '@/router'
import store from '@/store'
axios.defaults.timeout = 5000;
const baseURL = process.env.API_ROOT;
axios.interceptors.response.use(
	response=>{return response},
	err=>{
		if (err.response) {
			switch (err.response.status) {
				case 401:
					console.log('401拦截');
					store.commit('account/logout');
					router.push('/');
			}
		}
		return Promise.reject(err.response.data)
	});
export function fetch(url, params = {}){
	return new Promise((resolve,reject)=>{
		axios.get(baseURL+url,{
			params:params
		}).then(response=>{
			resolve(response)
		}).catch(err=>{
			reject(err)
		})
	})
}

export function post(url, data = {},op = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}}) {
	return new Promise((resolve,reject)=>{
		axios.post(baseURL+url,qs.stringify(data),op)
			.then(response=>{
				resolve(response)
			}).catch(err=>{
			reject(err)
		})
	})
}

export function post_form(url, data, op = {headers: {'Content-Type': 'multipart/form-data'},timeout:100000}) {
	return new Promise((resolve,reject)=>{
		axios.post(baseURL+url,data,op)
			.then(response=>resolve(response))
			.catch(err=>reject(err))
	})
}
