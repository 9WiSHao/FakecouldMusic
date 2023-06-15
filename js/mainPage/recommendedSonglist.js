import { API } from '../API.js';
import { SongList } from '../songList/songList.js';

export class RecommendedSonglist {
	constructor() {
		this.mainBodyRightMainDOM = document.querySelector('.main-body-right-main');
		this.#renderHTML();
		this.recommendedSonglistBodyContentDOM = document.querySelector('.recommended-songlist-body-content');
		this.recommendedSonglistBodyDOM = document.querySelector('.recommended-songlist-body');

		this.#fetchData();
	}

	#renderHTML = () => {
		this.mainBodyRightMainDOM.insertAdjacentHTML(
			'beforeend',
			`
        <div class="recommended-songlist-body">
            <div class="recommended-songlist-body-title">推荐歌单</div>
            <div class="recommended-songlist-body-content">
            </div>
        </div>
        `
		);
	};

	#fetchData = async () => {
		let res = await fetch(`${API.url}${API.recommendedSonglist}?limit=10`);
		let data = await res.json();
		this.#renderData(data);
		this.#setButton();
	};

	#renderData = (data) => {
		for (let i = 0; i < 10; i++) {
			this.recommendedSonglistBodyContentDOM.insertAdjacentHTML(
				'beforeend',
				`
                <div class="recommended-songlist-body-content-item" data-listid="${data.result[i].id}">
                    <img class="recommended-songlist-body-content-item-img" src="${data.result[i].picUrl}" />
                    <div class="recommended-songlist-body-content-item-title">${data.result[i].name}</div>
                    <div class="recommended-songlist-body-content-item-playcount">
                        <img class="recommended-songlist-body-content-item-playcount-icon" src="./picture/icon/hollowPlay_icon.png" />
                    ${this.#playCountFormat(data.result[i].playCount)}</div>
                    <div class="recommended-songlist-body-content-item-play"></div>
                </div>
                `
			);
		}
	};

	#playCountFormat = (number) => {
		if (number > 100000 && number < 100000000) {
			return `${Math.floor(number / 10000)}万`;
		}
		if (number > 100000000) {
			return `${Math.floor(number / 100000000)}亿`;
		}
		return number;
	};

	#setButton = () => {
		this.recommendedSonglistBodyContentDOM.addEventListener('click', (e) => {
			let list = e.target.closest('.recommended-songlist-body-content-item');
			if (!list) {
				return;
			}

			let listId = list.dataset.listid;

			window.location.hash = `#/musiclist/${listId}`;
		});
	};

	delete = () => {
		// 如果我要把某次new出来的实例的监听器也一块移除，就必须这么写，清空html，不然重新打开这个页面的时候，其实老对象没被销毁，会导致有一样的html元素被绑定了多次一样的东西（太坑了）、
		this.recommendedSonglistBodyDOM.innerHTML = '';
		this.recommendedSonglistBodyDOM.remove();
	};
}
