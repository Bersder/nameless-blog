import Vue from 'vue'
import Router from 'vue-router'
import Article from '@/views/Article'
import Anime from '@/views/Anime'
import Code from '@/views/Code'
import Game from '@/views/Game'
import Trivial from '@/views/Trivial'
import Note from '@/views/Note'
import Search from '@/views/Search'
import Series from '@/views/Series'
import Homepage from '@/views/Homepage'
import Write from '@/views/Write'
import TakeNote from "@/views/TakeNote"
import Archive from "@/views/Archive"
import Link from "@/views/Link"
import Tag from "@/views/Tag"
import Login from "@/views/Login"
import About from "@/views/About"
import Space from "@/views/Space"
import SpaceLaunch from "@/components/SpaceLaunch";
import SpaceDynamic from "@/components/SpaceDynamic";
import SpaceAlbum from "@/components/SpaceAlbum";
import SpaceSetting from "@/components/SpaceSetting";
import NotFind404 from "@/components/_404";
import Bangumi from "../views/Bangumi"
import UCONF from "../config/user.conf";
Vue.use(Router);
const title = UCONF.siteTitle.title;
const title_ = UCONF.siteTitle.title_;
const subTitle = UCONF.siteTitle.subTitle;

export default new Router({
	mode:'history',
	routes:[
		{
			path: '/',
			name: 'homepage',
			component:Homepage,
			meta:{title:title+' | '+subTitle}
		},
		{
			path:'/space',
			name: 'space',
			component:Space,
			meta:{loginStatus:false,title:title+'的空间',nh:true},
			children: [
				{path:'launch',name:'space-l',component:SpaceLaunch,meta:{title:'空间·发布'+title_,nh:true}},
				{path:'dynamic',name:'space-d',component:SpaceDynamic,meta:{title:'空间·动态'+title_,nh:true}},
				{path:'album',name:'space-a',component:SpaceAlbum,meta:{title:'空间·相册'+title_,nh:true}},
				{path:'setting',name:'space-s',component:SpaceSetting,meta:{title:'空间·设置'+title_,nh:true}}
			]
		},
		{
			path: '/write',
			name: 'write',
			component: Write,
			meta:{loginStatus:false,title:'文章草稿'}
		},
		{
			path: '/takenote',
			name: 'takenote',
			component: TakeNote,
			meta:{loginStatus:false,title:'笔记草稿'}
		},
		{
			path: '/login',
			name: 'login',
			component:Login,
			meta:{loginStatus:false,title:'Sign In'+title_}
		},
		{
			path: '/search/:key',
			name: 'search',
			component:Search,
			meta:{nh:true}
		},
		{
			path: '/tags',
			name: 'tag',
			component:Tag,
			children:[{path:':tag'}]
		},
		{
			path: '/archive',
			name: 'archive',
			component: Archive,
			meta:{title:'归档'+title_}
		},
		{
			path: '/archive/:type/:id',
			name: 'article',
			component: Article,
			meta:{nh:true}
		},
		{
			path: '/links',
			name: 'link',
			component: Link,
			meta:{title:'友链'+title_}
		},
		{
			path: '/archive/anime',
			name: 'anime',
			component: Anime,
			meta:{title:'Anime'+title_}
		},
		{
			path: '/archive/code',
			name: 'code',
			component: Code,
			meta:{title:'猴子敲代码'+title_}
		},
		{
			path: '/archive/game',
			name: 'game',
			component: Game,
			meta:{title:'努力学习，拼命玩'+title_}
		},
		{
			path: '/archive/trivial',
			name: 'trivial',
			component: Trivial,
			meta:{title:'什么都有'+title_}
		},
		{
			path: '/note',
			name: 'note',
			component: Note,
			meta:{title:'笔记'+title_}
		},
		{
			path: '/bangumi',
			name: 'bangumi',
			component: Bangumi,
			meta:{title:'番组'+title_,nh:true}
		},
		{
			path: '/note/:id',
			name: 'article_note',
			component: Article,
			meta:{nh:true}
		},
		{
			path: '/about',
			name: 'about',
			component: About,
			meta:{title:'关于'+title_,nh:true}
		},
		{
			path: '/series/:serName',
			name: 'series',
			component: Series,
			meta:{nh:true}
		},
		{
			path: '*',
			name: 'NotFind404',
			component:NotFind404,
			meta:{title:'页面没找到'}
		},
	]
})
