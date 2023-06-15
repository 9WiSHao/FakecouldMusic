import { Leaderboard } from './leaderboard.js';
import { Slider } from './slider.js';
import { RecommendedSonglist } from './recommendedSonglist.js';

export class MainTable {
	#currentHash = '';
	#currentHashPart = '';
	#currentPage = [];

	constructor() {
		this.headDOM = document.querySelector('head');
		this.mainBodyRightDOM = document.querySelector('.main-body-right');
		this.#renderHTML();
		this.mainBodyRightTopDOM = document.querySelector('.main-body-right-top');

		this.#init();
		this.#setButton();
		window.addEventListener('hashchange', this.#handleRouting);
	}

	#renderHTML = () => {
		this.mainBodyRightDOM.insertAdjacentHTML(
			'beforeend',
			`<div class="main-body-right-top">
          <div class="personality-recommendations main-body-right-top-selected">
          个性推荐
              <span class="main-body-right-top-selected-line"></span>
          </div>
          <div class="custom-made">专属定制</div>
          <div class="the-playlist">歌单</div>
          <div class="league-tables">排行榜</div>
          <div class="singer">歌手</div>
          <div class="lastest-song">最新音乐</div>
      </div>
      <div class="main-body-right-main"></div>
        `
		);

		this.mainBodyRightTopCSS = document.createElement('link');
		this.mainBodyRightTopCSS.rel = 'stylesheet';
		this.mainBodyRightTopCSS.href = './css/mainPage/mainPageRightTable.css';
		this.headDOM.appendChild(this.mainBodyRightTopCSS);
	};

	#init = () => {
		window.location.hash = '#/mainpage/recommend';
	};

	#setButton = () => {
		this.mainBodyRightTopDOM.addEventListener('click', (e) => {
			if (e.target == this.mainBodyRightTopDOM || e.target.classList.contains('main-body-right-top-selected') || e.target.classList.contains('main-body-right-top-selected-line')) {
				return;
			}

			for (let item of this.mainBodyRightTopDOM.children) {
				if (item.classList.contains('main-body-right-top-selected')) {
					item.classList.remove('main-body-right-top-selected');
					item.children[0].remove();
				}
			}
			e.target.classList.add('main-body-right-top-selected');

			e.target.insertAdjacentHTML('beforeend', '<span class="main-body-right-top-selected-line"></span>');

			if (e.target.innerText == '个性推荐') {
				window.location.hash = '#/mainpage/recommend';
			}
			if (e.target.innerText == '排行榜') {
				window.location.hash = '#/mainpage/leaderboard';
			}
		});
	};

	#currentDelect = () => {
		if (this.#currentPage.length > 0) {
			this.#currentPage.forEach((component) => {
				component.delete();
			});
			this.#currentPage = [];
		}
	};

	#handleRouting = () => {
		let hash = window.location.hash;
		let hashPart = hash.split('/');

		// 由于这是个二级路由，所以只检测一级路由匹配的才调用后面的改变。（主要原因就是那个监听路由变化的函数只要是个变化他就动，只能这么区别）
		if (hashPart[1] != 'mainpage') {
			return;
		}

		if (hash === this.#currentHash) {
			return;
		}

		console.log(this.#currentPage);

		switch (hashPart[2]) {
			case 'recommend':
				this.#currentDelect();
				this.#currentPage.push(new Slider());
				this.#currentPage.push(new RecommendedSonglist());
				break;
			case 'leaderboard':
				this.#currentDelect();
				this.#currentPage.push(new Leaderboard());
				break;
		}

		this.#currentHash = hash;
		this.#currentHashPart = hashPart;
	};

	delete = () => {
		// 如果我要把某次new出来的实例的监听器也一块移除，就必须这么写，清空html，不然重新打开这个页面的时候，其实老对象没被销毁，会导致有一样的html元素被绑定了多次一样的东西（太坑了）
		this.mainBodyRightTopDOM.innerHTML = '';
		this.mainBodyRightTopDOM.remove();
		let Db2 = document.querySelector('.main-body-right-main');
		Db2.innerHTML = '';
		Db2.remove();
		// 然后注意这个首页页面，有二级导航，就是有hash变化的监听器，置空html页面是删不掉的，需要单独删。。。麻麻的找了一个多小时才排查出来
		window.removeEventListener('hashchange', this.#handleRouting);

		this.headDOM.removeChild(this.mainBodyRightTopCSS);
	};
}
