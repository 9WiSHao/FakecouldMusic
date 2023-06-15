import { API } from '../API.js';
import { musicPlayer } from './mainPage.js';

export class Leaderboard {
	constructor() {
		this.mainBodyRightMainDOM = document.querySelector('.main-body-right-main');
		this.#renderHTML();

		this.#fetchTopList();
	}

	#renderHTML = () => {
		this.leaderboardBodyDOM = document.createElement('div');
		this.leaderboardBodyDOM.classList.add('leaderboard-body');

		this.leaderboardBodyDOM.innerHTML = `
        <div class="leaderboard-title">官方榜</div>
        `;

		this.mainBodyRightMainDOM.appendChild(this.leaderboardBodyDOM);
	};

	#fetchTopList = async () => {
		let res = await fetch(`${API.url}${API.getTopList}`);
		let data = await res.json();
		for (let i = 0; i < 4; i++) {
			await this.#fetchListDetail(data.list[i].id);
		}
		this.#addButton();
	};

	#fetchListDetail = async (listId) => {
		let res = await fetch(`${API.url}${API.getListDetail}?id=${listId}`);
		let data = await res.json();

		let dataList = {
			listId: listId,
			listName: data.playlist.name,
			listImg: data.playlist.coverImgUrl,
			song: [],
		};
		for (let i = 0; i <= 5; i++) {
			// 有的歌会带个括号里的别名，这里把它加上
			let songNameAll = data.playlist.tracks[i].name;
			if (data.playlist.tracks[i].alia[0] != undefined) {
				songNameAll += `<b>（${data.playlist.tracks[i].alia[0]}）</b>`;
			}
			// 有的歌作者有好几个，这加上
			let songSingerAll = data.playlist.tracks[i].ar[0].name;
			for (let j = 1; j < data.playlist.tracks[i].ar.length; j++) {
				songSingerAll += `/ ${data.playlist.tracks[i].ar[j].name}`;
			}

			dataList.song[i] = {
				songId: data.playlist.tracks[i].id,
				songScore: data.playlist.trackIds[i].ratio,
				songName: songNameAll,
				songSinger: songSingerAll,
			};
		}

		this.#renderTopList(dataList);
	};

	#renderTopList = (dataList) => {
		let songs = '';
		for (let i = 0; i < 5; i++) {
			// 这是区分飙升榜和别的榜，没那个%热度
			let otherClass = 'img';
			let songScore = '';
			if (dataList.song[i].songScore != undefined) {
				otherClass = 'score';
				songScore = `${dataList.song[i].songScore}%`;
			}

			songs += `
            <div class="leaderboard-list-song" data-songid="${dataList.song[i].songId}">
                <div class="leaderboard-list-song-left">
                    <div class="leaderboard-list-song-number">${i + 1}</div>
                    <div class="leaderboard-list-song-${otherClass}">${songScore}</div>
                    <div class="leaderboard-list-song-name">${dataList.song[i].songName}</div>
                </div>
                <div class="leaderboard-list-song-right">
                    <div class="leaderboard-list-song-singer">${dataList.song[i].songSinger}</div>
                </div> 
            </div>
            `;
		}
		this.leaderboardBodyDOM.insertAdjacentHTML(
			'beforeend',
			`
        <div class="leaderboard-list" data-listid="${dataList.listId}">
            <div class="leaderboard-list-left">
                <img src="${dataList.listImg}" alt="图" />
            </div>
            <div class="leaderboard-list-right">
                ${songs}
            </div>
        </div>
        `
		);
	};

	#addButton = () => {
		this.leaderboardBodyDOM.addEventListener('click', (e) => {
			let song = e.target.closest('.leaderboard-list-song');
			if (!song) {
				return;
			}

			let songList = e.target.closest('.leaderboard-list-right');
			for (let item of songList.children) {
				if (item.classList.contains('leaderboard-list-song-selected')) {
					songList.children[i].classList.remove('leaderboard-list-song-selected');
				}
			}
			song.classList.add('leaderboard-list-song-selected');
		});

		this.leaderboardBodyDOM.addEventListener('dblclick', (e) => {
			let song = e.target.closest('.leaderboard-list-song');
			if (!song) {
				return;
			}
			musicPlayer.fetchMusic(song.dataset.songid);
		});
	};

	delete = () => {
		// 如果我要把某次new出来的实例的监听器也一块移除，就必须这么写，清空html，不然重新打开这个页面的时候，其实老对象没被销毁，会导致有一样的html元素被绑定了多次一样的东西（太坑了）
		this.leaderboardBodyDOM.innerHTML = '';
		this.leaderboardBodyDOM.remove();
	};
}
