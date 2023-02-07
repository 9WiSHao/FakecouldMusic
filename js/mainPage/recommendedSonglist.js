import { API } from '../API.js';

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
                        <img class="recommended-songlist-body-content-item-playcount-icon" src="../../picture/icon/hollowPlay_icon.png" />
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
			console.log(listId);
		});
	};

	delete = () => {
		this.recommendedSonglistBodyDOM.remove();
	};
}
