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

Vue.use(Router);

export default new Router({
	mode:'history',
	routes:[
		{
			path: '/',
			name: 'homepage',
			component:Homepage
		},
		{
			path:'/space',
			name: 'space',
			component:Space,
			meta:{loginStatus:false},
			children: [
				{path:'launch',name:'space-l',component:SpaceLaunch},
				{path:'dynamic',name:'space-d',component:SpaceDynamic},
				{path:'album',name:'space-a',component:SpaceAlbum},
				{path:'setting',name:'space-s',component:SpaceSetting}
			]
		},
		{
			path: '/login',
			name: 'login',
			component:Login,
			meta:{loginStatus:false}
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
			component: Archive
		},
		{
			path: '/archive/:type/:id',
			name: 'article',
			component: Article
		},
		{
			path: '/links',
			name: 'link',
			component: Link
		},
		{
			path: '/archive/anime',
			name: 'anime',
			component: Anime
		},
		{
			path: '/archive/code',
			name: 'code',
			component: Code
		},
		{
			path: '/archive/game',
			name: 'game',
			component: Game
		},
		{
			path: '/archive/trivial',
			name: 'trivial',
			component: Trivial
		},
		{
			path: '/note',
			name: 'note',
			component: Note
		},
		{
			path: '/note/:id',
			name: 'article_note',
			component: Article
		},
		{
			path: '/about',
			name: 'about',
			component: About
		},
		{
			path: '/write',
			name: 'write',
			component: Write
		},
		{
			path: '/takenote',
			name: 'takenote',
			component: TakeNote
		},
	]
})
