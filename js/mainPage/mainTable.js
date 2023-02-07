import { Leaderboard } from './leaderboard.js';
import { Slider } from './slider.js';
import { RecommendedSonglist } from './recommendedSonglist.js';

export class MainTable {
	constructor() {
		this.headDOM = document.querySelector('head');
		this.mainBodyRightTopDOM = document.querySelector('.main-body-right-top');
		this.#renderHTML();
		this.#init();
		this.#setButton();
	}

	#renderHTML = () => {
		this.mainBodyRightTopDOM.insertAdjacentHTML(
			'beforeend',
			`
        <div class="personality-recommendations main-body-right-top-selected">
        个性推荐
            <span class="main-body-right-top-selected-line"></span>
        </div>
        <div class="custom-made">专属定制</div>
        <div class="the-playlist">歌单</div>
        <div class="league-tables">排行榜</div>
        <div class="singer">歌手</div>
        <div class="lastest-song">最新音乐</div>
        `
		);

		this.mainBodyRightTopCSS = document.createElement('link');
		this.mainBodyRightTopCSS.rel = 'stylesheet';
		this.mainBodyRightTopCSS.href = './css/mainPage/mainPageRightTable.css';
		this.headDOM.appendChild(this.mainBodyRightTopCSS);
	};

	#init = () => {
		this.sliderClass = new Slider();
		this.recommendedSonglist = new RecommendedSonglist();
		this.leaderboardClass = null;
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
				this.sliderClass = new Slider();
				this.recommendedSonglist = new RecommendedSonglist();

				this.leaderboardClass.delete();
				this.leaderboardClass = null;
			}
			if (e.target.innerText == '排行榜') {
				this.leaderboardClass = new Leaderboard();

				this.sliderClass.delete();
				this.sliderClass = null;
				this.recommendedSonglist.delete();
				this.recommendedSonglist = null;
			}
		});
	};

	delete = () => {
		this.mainBodyRightTopDOM.innerHTML = '';
		this.headDOM.removeChild(this.mainBodyRightTopCSS);
	};
}
