import { search } from '../mainPage/mainPage.js';
import { API } from '../API.js';

export class HotSearch {
	constructor() {
		this.searchDOM = document.querySelector('.main-header .main-header-left .search');
		this.searchInputDOM = document.querySelector('.main-header .main-header-left .search input');

		this.#setButtonBefore();
	}

	#setButtonBefore = () => {
		this.searchInputDOM.addEventListener('focus', () => {
			this.#renderHotSearch();
			this.searchInputDOM.addEventListener('input', (e) => {
				if (e.target.value != '') {
					this.#delete();
				} else {
					this.#renderHotSearch();
				}
			});
		});
	};

	#renderHotSearch = async () => {
		this.hotSearchBody = document.createElement('div');
		this.hotSearchBody.classList.add('hot-search-body');
		this.hotSearchBody.innerHTML = `
            <div class="hot-search-title">热搜榜</div>
        `;
		this.searchDOM.insertAdjacentElement('beforeEnd', this.hotSearchBody);

		let hotMessage = await fetch(`${API.url}${API.hotSearch}`);
		let hotData = await hotMessage.json();

		for (let i = 0; i < hotData.data.length; i++) {
			let iconUrl = '';
			if (hotData.data[i].iconUrl != null) {
				iconUrl = hotData.data[i].iconUrl;
			}
			this.hotSearchBody.insertAdjacentHTML(
				'beforeEnd',
				`
            <div class="hot-search-main">
                <div class="hot-search-number">${i + 1}</div>
                <div class="hot-search-message">
                    <div class="hot-search-message-top">
                        <div class="hot-search-word">${hotData.data[i].searchWord}</div>
                        <div class="hot-search-score">${hotData.data[i].score}</div>
                        <img class="hot-search-hot" src="${iconUrl}" />
                    </div>
                    <div class="hot-search-message-detail">${hotData.data[i].content}</div>
                </div>
            </div>
            `
			);
		}
		this.#setButtonAfter();
	};

	#setButtonAfter = () => {
		this.hotSearchBody.addEventListener('click', (e) => {
			let hotWord = e.target.closest('.hot-search-main');
			if (!hotWord) {
				return;
			}
			search.fetchSearchData(hotWord.children[1].children[0].children[0].innerText);
			this.#delete();
		});

		this.hotSearchBody.addEventListener('mouseover', () => {
			this.hotSearchBody.addEventListener('mouseleave', () => {
				this.#delete();
			});
		});
	};

	#delete = () => {
		this.hotSearchBody.remove();
	};
}
