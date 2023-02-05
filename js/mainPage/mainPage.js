import { Login } from '../login/login.js';
import { Slider } from './slider.js';
import { MusicPlayer } from './musicPlayer.js';
import { Search } from '../search/search.js';
import { MainTable } from './mainTable.js';
import { HotSearch } from '../search/hotSearch.js';

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
let mainPageThings = {
	// 首页顶部栏的点击变化
	mainTab: new MainTable(),
	// 轮播图
	slider: new Slider(),
};

window.addEventListener('hashchange', () => {
	if (window.location.hash == '#/search') {
		for (let key in mainPageThings) {
			mainPageThings[key].delete();
			mainPageThings[key] = null;
		}
	}
	if (window.location.hash == '#/mainpage') {
		search.delete();
		mainPageThings.mainTab = new MainTable();
		mainPageThings.slider = new Slider();
	}
});

export let musicPlayer = new MusicPlayer(1454946709);
