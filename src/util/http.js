import axios from 'axios';
import qs from 'qs'
axios.defaults.timeout = 5000;

export function fetch(url, params = {}){
	return new Promise((resolve,reject)=>{
		axios.get(url,{
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
		axios.post(url,qs.stringify(data),op)
			.then(response=>{
				resolve(response)
			}).catch(err=>{
			reject(err)
		})
	})
}

export function post_form(url, data, op = {headers: {'Content-Type': 'multipart/form-data'},timeout:100000}) {
	return new Promise((resolve,reject)=>{
		axios.post(url,data,op)
			.then(response=>resolve(response))
			.catch(err=>reject(err))
	})
}
