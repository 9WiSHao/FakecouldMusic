import { API } from '../API.js';
import { musicPlayer } from './mainPage.js';

export class Slider {
	constructor() {
		// 最先渲染出轮播图html框架和css
		this.headDOM = document.querySelector('head');
		this.mainBodyRightMain = document.querySelector('.main-body-right-main');
		this.#renderHTML();

		this.sliderBoxDOM = document.querySelector('.slider-box');
		this.sliderLeftBtnDOM = document.querySelector('.slider-left-btn');
		this.sliderRightBtnDOM = document.querySelector('.slider-right-btn');
		this.bannerBoxDOM = document.querySelector('.banner-box');
		this.paginationBoxDOM = document.querySelector('.pagination-box');

		this.bannerItemDOMs = null;
		this.bannerItemDOMsLength = 0;
		// 轮播图未加载出来时，显示的图片（数组，8个）
		this.banners = [
			{ imageName: `../../picture/icon/loading_temp.png` },
			{ imageName: `../../picture/icon/loading_temp.png` },
			{ imageName: `../../picture/icon/loading_temp.png` },
			{ imageName: `../../picture/icon/loading_temp.png` },
			{ imageName: `../../picture/icon/loading_temp.png` },
			{ imageName: `../../picture/icon/loading_temp.png` },
			{ imageName: `../../picture/icon/loading_temp.png` },
			{ imageName: `../../picture/icon/loading_temp.png` },
		];
		// 定时器
		this.timer = null;
		// 初始化
		this.#init();
	}

	#renderHTML = () => {
		this.mainBodyRightMain.insertAdjacentHTML(
			'afterbegin',
			`
        <div class="slider-box">
            <div class="banner-box"></div>
            <button class="slider-left-btn"><img src="../../picture/icon/back_icon.png" alt="" /></button>
            <button class="slider-right-btn"><img src="../../picture/icon/next_icon.png" alt="" /></button>
            <div class="pagination-box"></div>
        </div>
        `
		);

		this.sliderCSS = document.createElement('link');
		this.sliderCSS.rel = 'stylesheet';
		this.sliderCSS.href = '../../css/mainPage/slider.css';
		this.headDOM.appendChild(this.sliderCSS);
	};

	#init = () => {
		// 渲染轮播图
		this.#drawDOM(this.banners);
		// 获取轮播图节点以及其他数据
		this.bannerItemDOMs = this.sliderBoxDOM.querySelectorAll('.banner-item');
		this.bannerItemDOMsLength = this.bannerItemDOMs.length;
		this.currentIndex = 0;
		// 点击左右按钮切换轮播图，以及鼠标移入移出显示按钮
		this.#sliderSwitch();
		// 自动轮播
		this.#openTimer();
		this.sliderBoxDOM.addEventListener('mouseover', this.#stopTimer);
		this.sliderBoxDOM.addEventListener('mouseout', this.#openTimer);
		// 从后端获取轮播图数据（图片src以及点击类型之类）
		this.#fetchBanners();
	};
	// 记数器，记录当前所展示的横幅序号
	#currentIndex = 0;

	get currentIndex() {
		return this.#currentIndex;
	}
	// 使用了set方法，每当记数器currentIndex（不带#的）变化，就能调用，根据变换来改变当前的banner
	set currentIndex(num) {
		// 这个num就是每次改变后currentIndex的值
		// 初始化banner,这里用了了Object.values()方法，把一组DOM节点对象转换为数组
		Object.values(this.bannerItemDOMs).forEach((item, i) => {
			item.classList.remove('left', 'middle', 'right');
			item.onclick = null;
			this.paginationBoxDOM.children[i].classList.remove('chose');
		});

		if (num < 0) {
			this.#currentIndex = this.bannerItemDOMsLength - 1;
		} else if (num >= this.bannerItemDOMsLength) {
			this.#currentIndex = 0;
		} else {
			this.#currentIndex = num;
		}
		// 这是设置下方小圆点
		this.paginationBoxDOM.children[this.#currentIndex].classList.add('chose');
		// 设置展示的轮播图所带样式
		if (this.#currentIndex === 0) {
			this.#showCurrentBanner(this.bannerItemDOMsLength - 1, this.#currentIndex, this.#currentIndex + 1);
		} else if (this.#currentIndex === this.bannerItemDOMsLength - 1) {
			this.#showCurrentBanner(this.#currentIndex - 1, this.#currentIndex, 0);
		} else {
			this.#showCurrentBanner(this.#currentIndex - 1, this.#currentIndex, this.#currentIndex + 1);
		}
	}

	delete = () => {
		this.sliderBoxDOM.remove();
		this.sliderCSS.remove();
	};

	#showCurrentBanner = (leftIndex, middleIndex, rightIndex) => {
		// 设置展示的轮播图所带样式
		this.bannerItemDOMs[leftIndex].classList.add('left');
		this.bannerItemDOMs[middleIndex].classList.add('middle');
		this.bannerItemDOMs[rightIndex].classList.add('right');
		this.bannerItemDOMs[leftIndex].onclick = () => {
			this.currentIndex--;
		};
		this.bannerItemDOMs[rightIndex].onclick = () => {
			this.currentIndex++;
		};
	};
	// 从后端获取数据并渲染
	#fetchBanners = async () => {
		let bannerMessages = await fetch(`${API.url}${API.homePageJson}`);
		let bannerParse = await bannerMessages.json();

		this.bannerItemDOMs.forEach((item, i) => {
			// 渲染图片
			item.children[0].src = bannerParse.data.blocks[0].extInfo.banners[i].pic;
			// 渲染右下角分类小标题
			item.children[1].innerText = bannerParse.data.blocks[0].extInfo.banners[i].typeTitle;
			if (bannerParse.data.blocks[0].extInfo.banners[i].titleColor == 'red') {
				item.children[1].style.backgroundColor = '#c94c4c';
			}
			if (bannerParse.data.blocks[0].extInfo.banners[i].titleColor == 'blue') {
				item.children[1].style.backgroundColor = '#5477ca';
			}
			// 点击事件
			item.addEventListener('click', () => {
				// 活动链接就点击跳转到对应的活动页面
				if (bannerParse.data.blocks[0].extInfo.banners[i].url != null) {
					window.open(bannerParse.data.blocks[0].extInfo.banners[i].url);
				}
				// 音乐单曲就点击调用播放器播放
				if (bannerParse.data.blocks[0].extInfo.banners[i].song != null) {
					musicPlayer.fetchMusic(bannerParse.data.blocks[0].extInfo.banners[i].song.id);
				}
				// 歌单专辑就点击跳转到对应的专辑页面
				if (bannerParse.data.blocks[0].extInfo.banners[i].targetId != null) {
				}
			});
		});
	};

	#drawDOM = (banners) => {
		// 渲染轮播图
		this.bannerBoxDOM.innerHTML = banners.reduce((html, item) => {
			return html + `<div class="banner-item"><img src="${item.imageName}"><div class="typeTitle"></div></div>`;
		}, '');
		// 渲染下方小圆点
		banners.forEach((item, i) => {
			const span = document.createElement('span');
			span.addEventListener('mouseover', () => {
				// 鼠标移入第几个小圆点，就把计数器设置为第几个，也就是展示第几个轮播图
				this.currentIndex = i;
			});
			this.paginationBoxDOM.append(span);
		});
	};
	// 点击左右切换轮播图
	#sliderSwitch = () => {
		this.sliderBoxDOM.addEventListener('mouseover', () => {
			this.sliderLeftBtnDOM.style.opacity = '0.6';
			this.sliderRightBtnDOM.style.opacity = '0.6';
		});
		this.sliderBoxDOM.addEventListener('mouseout', () => {
			this.sliderLeftBtnDOM.style.opacity = '0';
			this.sliderRightBtnDOM.style.opacity = '0';
		});

		this.sliderLeftBtnDOM.addEventListener('click', () => {
			this.currentIndex--;
		});
		this.sliderRightBtnDOM.addEventListener('click', () => {
			this.currentIndex++;
		});
	};
	// 自动轮播
	#openTimer = () => {
		if (!!this.timer) {
			clearInterval(this.timer);
		}

		this.timer = setInterval(() => {
			this.currentIndex++;
		}, 3000);
	};
	#stopTimer = () => {
		clearInterval(this.timer);
	};
}
