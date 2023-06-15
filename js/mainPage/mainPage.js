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
	window.location.hash = `#/mainpage`;
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

// 存当前页面的变量，顺便把删除包成函数。
// 选择每次都在case匹配到之后再调用删除，是为了判断二级页面不删。
// 之前选择的是删除放每次匹配的最前面，这样就没法判断是不是二级页面了，会每次hash变化都全删了
let currentPage = null;
function currentDelect() {
	if (currentPage != null) {
		currentPage.delete();
		currentPage = null;
	}
}
// 这玩意来解决第一次打开页面可能调用了两回路由，就出现了俩首页的问题
let currentHash = '';
let currentHashPart = '';
// 初始化是主页
window.location.hash = `#/mainpage`;

// 简单的原生js hash路由
function handleRouting() {
	let hash = window.location.hash;
	let hashPart = hash.split('/');

	// 如果 hash 没有改变，直接返回，不做任何操作，解决初次打开生成俩首页组件
	if (hash === currentHash) {
		return;
	}

	switch (hashPart[1]) {
		case 'mainpage':
			if (hashPart[1] == currentHashPart[1]) {
				break;
			}
			currentDelect();
			currentPage = new MainTable();
			break;

		case 'search':
			currentDelect();
			currentPage = new Search(decodeURI(hashPart[2]));
			break;

		case 'musiclist':
			currentDelect();
			currentPage = new SongList(decodeURI(hashPart[2]));
			break;

		case 'album':
			currentDelect();
			// 专辑居然和歌单不一样，妈的，以后再做
			window.location.href = `../../404.html?${hashPart[2]}`;
	}

	// 更新 currentHash
	currentHash = hash;
	currentHashPart = hashPart;
}

// 页面加载时调用一次路由处理函数，解决刷新时首页空白问题
window.addEventListener('load', handleRouting);
// hash 变化时调用路由处理函数
window.addEventListener('hashchange', handleRouting);

export let musicPlayer = new MusicPlayer(1944660978);
