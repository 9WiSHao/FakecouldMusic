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

// 搜索
export let search = new Search();
new HotSearch();

// 登录界面
let userLonginDOM = document.querySelector('.main-header-right .user');
let userNameDOM = document.querySelector('.main-header-right .user .user-name');
userLonginDOM.addEventListener('click', () => {
	if (userNameDOM.innerHTML == '未登录' && document.querySelector('.login-border') == null) {
		new Login();
	}
});

// 初始化是主页
window.location.hash = `#/mainpage`;

let mainTab = new MainTable();

window.addEventListener('hashchange', () => {
	if (window.location.hash == '#/search') {
		if (mainTab != null) {
			mainTab.delete();
			mainTab = null;
		}
	}
	if (window.location.hash == '#/mainpage') {
		if (search.survive()) {
			search.delete();
		}
		if (document.querySelector('.songlist-body')) {
			document.querySelector('.songlist-body').remove();
		}
		if (mainTab == null) {
			mainTab = new MainTable();
		}
	}
	if (window.location.hash == '#/musiclist') {
		if (mainTab != null) {
			mainTab.delete();
			mainTab = null;
		}
	}
});

export let musicPlayer = new MusicPlayer(1944660978);
