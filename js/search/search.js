import { API } from '../API.js';
import { musicPlayer } from '../mainPage/mainPage.js';

export class Search {
	constructor() {
		this.headDOM = document.querySelector('head');
		this.mainBodyRightMain = document.querySelector('.main-body-right-main');

		this.#renderHTML();
		this.#inint();
	}
	#renderHTML = () => {
		// this.mainBodyRightMain.insertAdjacentHTML(
		// 	'beforeend',
		// 	`
		//     <input class="playyyy" type="text" placeholder="输入歌曲id以听歌(敲回车开始)" />
		// `
		// );
		// this.playyyy = document.querySelector('.playyyy');
		// this.playyyy.addEventListener('keydown', (e) => {
		// 	if (e.key == 'Enter' && this.playyyy.value != '') {
		// 		musicPlayer.fetchMusic(this.playyyy.value);
		// 	}
		// });
	};
	#inint = () => {
		this.searchInputDOM = document.querySelector('.main-header .search-input');
		this.searchButtonDOM = document.querySelector('.main-header .search img');
		this.#addButton();
	};

	#addButton = () => {
		this.searchButtonDOM.addEventListener('click', () => {
			if (this.searchInputDOM.value != '') {
				this.#fetchSearchData(this.searchInputDOM.value);
			}
		});
		this.searchInputDOM.addEventListener('keydown', (e) => {
			if (e.key == 'Enter' && this.searchInputDOM.value != '') {
				this.#fetchSearchData(this.searchInputDOM.value);
			}
		});
	};

	#fetchSearchData = async (keyWord) => {
		let message = await fetch(`${API.url}${API.search}?keywords=${keyWord}`);
		let data = await message.json();
		console.log(data);
		window.location.hash = `#/search`;
	};
}
