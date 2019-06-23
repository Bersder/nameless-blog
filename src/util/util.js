export function debounce(fun, wait) {
	let timeout;
	return function () {
		let context = this;
		let args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			fun.apply(context,args)
		},wait);
	}
}

export function throttle(func, wait) {
	let context, args;
	let previous = 0;
	return function() {
		let now = +new Date();
		context = this;
		args = arguments;
		if (now - previous > wait) {
			func.apply(context, args);
			previous = now;
		}
	}
}
export function unique(arr) {
	let r = [];
	for (let i = 0; i < arr.length; i++){
		for(let j = i + 1; j < arr.length; j++)
			if (arr[i] === arr[j])i++;
		r.push(arr[i]);
	}
	return r;
}
export function fast_unique(arr) {
	let r = [];
	let obj = {};
	for(let i of arr){
		if(!obj[i]){
			r.push(i);
			obj[i] = 1;
		}
	}
	return r;

}
