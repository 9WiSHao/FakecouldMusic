import { Login } from '../login/login.js';
import { Slider } from './slider.js';

// 首页顶部栏的点击变化
let mainBodyRightTopDOM = document.querySelectorAll('.main-body-right-top div');
mainBodyRightTopDOM.forEach((item) => {
	item.addEventListener('click', () => {
		mainBodyRightTopDOM.forEach((item) => {
			if (item.classList.contains('main-body-right-top-selected')) {
				item.classList.remove('main-body-right-top-selected');
				item.children[0].remove();
			}
		});
		item.classList.add('main-body-right-top-selected');
		item.insertAdjacentHTML('beforeend', '<span class="main-body-right-top-selected-line"></span>');
	});
});

// 登录界面
let userLonginDOM = document.querySelector('.main-header-right .user');
let userNameDOM = document.querySelector('.main-header-right .user .user-name');
userLonginDOM.addEventListener('click', () => {
	if (userNameDOM.innerHTML == '未登录' && document.querySelector('.login-border') == null) {
		new Login();
	}
});

// 轮播图
new Slider();
