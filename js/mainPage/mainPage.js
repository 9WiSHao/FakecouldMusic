import { Login } from '../login/login.js';
import { MusicPlayer } from './musicPlayer.js';
import { Search } from '../search/search.js';
import { MainTable } from './mainTable.js';
import { HotSearch } from '../search/hotSearch.js';
import { SongList } from '../songList/songList.js';

// 前进后退按键直接拿浏览器的来用
document.querySelector('.nextAndBack .back').addEventListener('click', () => {
	window.history.back();
});
document.querySelector('.nextAndBack .next').addEventListener('click', () => {
	window.history.forward();
});

document.querySelector('.main-header-left .logo').addEventListener('click', () => {
	window.location.hash = `#/mainpage/recommend`;
});

// 热搜，这个是一直在主页不会动的，就直接new出来不用动他
new HotSearch();

// 搜索框，改变的是hash，显示搜索由路由部分读取hash的搜索词来显示
let searchInputDOM = document.querySelector('.main-header .search-input');
let searchButtonDOM = document.querySelector('.main-header .search img');
searchButtonDOM.addEventListener('click', () => {
	if (searchInputDOM.value != '') {
		window.location.hash = `#/search/${searchInputDOM.value}`;
	}
});
searchInputDOM.addEventListener('keydown', (e) => {
	if (e.key == 'Enter' && searchInputDOM.value != '') {
		window.location.hash = `#/search/${searchInputDOM.value}`;
	}
});

// 登录界面
let userLonginDOM = document.querySelector('.main-header-right .user');
let userNameDOM = document.querySelector('.main-header-right .user .user-name');
userLonginDOM.addEventListener('click', () => {
	if (userNameDOM.innerHTML == '未登录' && document.querySelector('.login-border') == null) {
		new Login();
	}
});

let currentPage = null;
// 这玩意来解决第一次打开页面可能调用了两回路由，就出现了俩首页的问题
let currentHash = '';
// 初始化是主页
window.location.hash = `#/mainpage/recommend`;

// 简单的原生js hash路由
function handleRouting() {
	let hash = window.location.hash;
	let hashPart = hash.split('/');

	// 如果 hash 没有改变，直接返回，不做任何操作
	if (hash === currentHash) {
		return;
	}

	if (currentPage != null) {
		currentPage.delete();
		currentPage = null;
	}

	switch (hashPart[1]) {
		case 'mainpage':
			currentPage = new MainTable();
			break;

		case 'search':
			currentPage = new Search(decodeURI(hashPart[2]));
			break;

		case 'musiclist':
			currentPage = new SongList(decodeURI(hashPart[2]));
			break;
	}

	// 更新 currentHash
	currentHash = hash;
}

// 页面加载时调用一次路由处理函数，解决刷新时首页空白问题
window.addEventListener('load', handleRouting);
// hash 变化时调用路由处理函数
window.addEventListener('hashchange', handleRouting);

export let musicPlayer = new MusicPlayer(1944660978);
