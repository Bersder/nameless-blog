import {throttle} from "./utils/lib";
export default (Vue,options={})=>{
	let init = {
		preloadClass:'lazyload-preload',
		default:'/static/images/loading_content.gif',
		error:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAA////U1NT9/f3LGVtlQAAAAR0Uk5TAP///7MtQIgAAACaSURBVHiczdIxDsMwCAVQVIklS6fey4szcLouLCw9Ygu1hUjs4qlSmKKn/ACOAa5e1SoDJBHhFMSqRKAlDJH/ANf6C962bEyc4f4CeOjgnpgB7hrwHiPoy4exJsB2OEIJtKpL8FUHAJpD+I+4hJapGViGSwokFGCzbYn7eP2rjLHrDMoR5AwWiVfB4dbbPvWiYztAff6Ww3XqA75spZ34fdQrAAAAAElFTkSuQmCC`,
		...options
	};
	let listenList = [];
	let imgCacheList = [];

	const isAlreadyLoad = (imgSrc)=>{
		return imgCacheList.indexOf(imgSrc) > -1;
	};

	const tryLoad = (item)=>{
		let {el,src} = item;
		let top  = el.getBoundingClientRect().top;
		let screenHeight = window.innerHeight || document.documentElement.clientHeight;
		if (top < screenHeight + 50 && top > -50){
			let img = new Image();
			img.src = src;
			img.onload = ()=>{
				el.src = src;
				el.classList.remove(init.preloadClass);
				imgCacheList.pushIfNew(src);
				listenList.remove(item);
			};
			img.onerror = ()=>{
				el.src = init.error;
				el.style.objectFit = 'none';
				listenList.remove(item);
			};
			return true;
		}else{
			return false;
		}
	};

	let listenStatus = false;
	const listenScroll = ()=>{
		if (!listenStatus){
			//console.log('lazyload Start');
			window.addEventListener('scroll',throttle(()=>{
				let len = listenList.length;
				//console.log(len,listenList,imgCacheList);
				for (let i = 0; i < len; i++){
					tryLoad(listenList[i])
				}
			},100));
			listenStatus = true;
		}
	};

	Vue.directive('lazyload',{
		inserted:(el,binding)=>{
			let imgSrc,placeholder;
			if (typeof binding.value==='string'){
				imgSrc = binding.value;
				placeholder = init.default;
			}else{
				imgSrc = binding.value[0];
				placeholder = binding.value[1]||init.default;
			}
			if (isAlreadyLoad(imgSrc)){
				el.src = imgSrc;
				return false;
			}
			let item = {
				el:el,
				src:imgSrc
			};
			el.src = placeholder;
			el.classList.add(init.preloadClass);
			if (tryLoad(item)){
				return;
			}
			listenList.pushIfNew(item);
			!listenStatus && listenScroll();
		}
	})
}
