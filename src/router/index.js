import Vue from 'vue'
import Router from 'vue-router'
import Article from '@/components/Article'
import Anime from '@/views/Anime'
import Code from '@/views/Code'
import Game from '@/views/Game'
import Trivial from '@/views/Trivial'
import Note from '@/views/Note'
import Search from '@/views/Search'
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
import {siteTitle} from "../util/USER_VAR";
Vue.use(Router);
const title = siteTitle.title;
const title_ = siteTitle.title_;
const subTitle = siteTitle.subTitle;

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
			meta:{loginStatus:false,title:title+'的空间'},
			children: [
				{path:'launch',name:'space-l',component:SpaceLaunch,meta:{title:'空间·发布'+title_}},
				{path:'dynamic',name:'space-d',component:SpaceDynamic,meta:{title:'空间·动态'+title_}},
				{path:'album',name:'space-a',component:SpaceAlbum,meta:{title:'空间·相册'+title_}},
				{path:'setting',name:'space-s',component:SpaceSetting,meta:{title:'空间·设置'+title_}}
			]
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
			component:Search
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
			component: Article
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
			path: '/note/:id',
			name: 'article_note',
			component: Article
		},
		{
			path: '/about',
			name: 'about',
			component: About,
			meta:{title:'关于'+title_}
		},
		{
			path: '/write',
			name: 'write',
			component: Write,
			meta:{title:'文章草稿'}
		},
		{
			path: '/takenote',
			name: 'takenote',
			component: TakeNote,
			meta:{title:'笔记草稿'}
		},
	]
})
