import { Login } from '../login/login.js';
import { Slider } from './slider.js';
import { MusicPlayer } from './musicPlayer.js';
import { Search } from '../search/search.js';
import { MainTable } from './mainTable.js';

// 搜索
new Search();

// 登录界面
let userLonginDOM = document.querySelector('.main-header-right .user');
let userNameDOM = document.querySelector('.main-header-right .user .user-name');
userLonginDOM.addEventListener('click', () => {
	if (userNameDOM.innerHTML == '未登录' && document.querySelector('.login-border') == null) {
		new Login();
	}
});

let mainPageThings = {
	// 首页顶部栏的点击变化
	mainTab: new MainTable(),
	// 轮播图
	slider: new Slider(),
};

// mainPageThings.mainTab.delete();
// mainPageThings.mainTab = null;
// mainPageThings.slider.delete();
// mainPageThings.slider = null;

export let musicPlayer = new MusicPlayer(1454946709);
