import { API } from '../API.js';
import { musicPlayer } from '../mainPage/mainPage.js';

export class Search {
	constructor(searchKey) {
		this.headDOM = document.querySelector('head');
		this.mainBodyRightDOM = document.querySelector('.main-body-right');

		this.#fetchSearchData(searchKey);
	}

	#fetchSearchData = async (keyWord) => {
		try {
			// 获取搜索数据
			let message = await fetch(`${API.url}${API.search}?keywords=${keyWord}`);
			let SongData = await message.json();

			this.#renderHTML();
			this.#init();
			await this.#renderSearchData(SongData, keyWord);

			let songsID = [];
			for (let i = 0; i < SongData.result.songs.length; i++) {
				songsID.push(SongData.result.songs[i].id);
			}
			this.#renderSongTime(songsID);
		} catch (err) {
			console.log(err);
		}
	};

	#renderHTML = () => {
		this.searchMainCSS = document.createElement('link');
		this.searchMainCSS.rel = 'stylesheet';
		this.searchMainCSS.href = './css/search/searchMain.css';
		this.headDOM.appendChild(this.searchMainCSS);

		this.mainBodyRightDOM.innerHTML = `
        <div class="search-message-body">
            <div class="search-message-top">
                <div class="search-itself">搜索 loading...</div>
                <div class="search-may-interested">你可能感兴趣</div>
                <div class="search-may-interested-detail">
                    <div class="search-may-interested-detail-left"><img src=".././../picture/icon/Akkarin.jpg" alt="" /></div>
                    <div class="search-may-interested-detail-right">
                        <div class="singer-name">歌手: loading...</div>
                        <div class="singer-detail">粉丝:loading..., 歌曲:loading...</div>
                    </div>
                </div>
            </div>
            <div class="search-message-main">
                <div class="search-message-main-table">
                    <div class="search-message-main-table-left">
                        <div class="search-songs search-table-selected">
                            单曲
                            <span class="search-line"></span>
                        </div>
                        <div class="search-singer">歌手</div>
                        <div>专辑</div>
                        <div>视频</div>
                        <div>歌单</div>
                        <div>歌词</div>
                        <div>博客</div>
                        <div>声音</div>
                        <div>用户</div>
                    </div>
                    <div class="search-message-main-table-right">共找到xxx首单曲</div>
                </div>
                <div class="search-message-function">
                    <div class="search-message-function-setinlist">
                        <div class="search-message-function-setinlist-triangle"></div>
                        播放全部(添加到播放列表)
                    </div>
                </div>
                <div class="get-songs">
                    <div class="songs-table-header">
                        <div></div>
                        <div>音乐标题</div>
                        <div>歌手</div>
                        <div>专辑</div>
                        <div>时长</div>
                        <div>热度</div>
                    </div>
                </div>
                <div class="get-singers"></div>
            </div>
        </div>  
        `;
	};

	#init = () => {
		this.getSongs = document.querySelector('.search-message-main .get-songs');
		this.playAllSongs = document.querySelector('.search-message-function-setinlist');
	};

	#renderSearchData = async (SongData, keyWord) => {
		this.searchItselfDOM = document.querySelector('.search-itself');
		this.searchItselfDOM.innerText = `搜索 ${keyWord}`;
		// 顶上的你可能感兴趣的歌手部分
		let interestedSinger = await this.#getInterestedSinger(SongData.result.songs[0].ar[0].id);
		this.searchMayInterestedDetail = document.querySelector('.search-may-interested-detail');
		this.searchMayInterestedDetail.innerHTML = `
            <div class="search-may-interested-detail-left"><img src="${interestedSinger.singerImg}" alt="" /></div>
            <div class="search-may-interested-detail-right">
                <div class="singer-name">歌手: ${interestedSinger.singerName}</div>
                <div class="singer-detail">粉丝:${interestedSinger.singerFans}, 歌曲:${interestedSinger.singerMusicSize}</div>
            </div>
        `;
		// 渲染主要搜索结果
		let songsCount = SongData.result.songCount;
		document.querySelector('.search-message-main-table-right').innerText = `共找到${songsCount}首单曲`;

		for (let i = 0; i < SongData.result.songs.length; i++) {
			let count = `${i + 1}`;
			if (count < 10) {
				count = `0${count}`;
			}
			let singerName = SongData.result.songs[i].ar[0].name;
			if (SongData.result.songs[i].ar.length > 1) {
				singerName += ' / ' + SongData.result.songs[i].ar[1].name;
			}
			let lyrics = '';
			if (SongData.result.songs[i].lyrics) {
				lyrics = '歌词：';
				for (let j = 0; j < SongData.result.songs[i].lyrics.length; j++) {
					lyrics += ` ${SongData.result.songs[i].lyrics[j]}`;
				}
			}

			this.getSongs.insertAdjacentHTML(
				'beforeend',
				`
            <div class="songs" data-id="${SongData.result.songs[i].id}">
                <div class="songs-base-message">
                    <div class="display1">
                        <div class="songs-number">${count}</div>
                        <div class="songs-love"><img src="" alt="" /></div>
                        <div class="songs-download"><img src="" alt="" /></div>
                    </div>
                    <div class="songs-name">${SongData.result.songs[i].name}</div>
                    <div class="songs-singer">${singerName}</div>
                    <div class="songs-album">${SongData.result.songs[i].al.name}</div>
                    <div class="songs-time">loading...</div>
                    <div class="songs-heat">
                        <div class="heat-bar" style="width: ${(SongData.result.songs[i].pop * 60) / 100}px"></div>
                        <div class="heat-background"></div>
                    </div>
                </div>
                <div class="songs-lyrics">${lyrics}</div>
            </div>
        `
			);
		}
		this.#addButtonAfter();
	};

	#addButtonAfter = () => {
		// 单击歌曲变色，双击放歌
		this.getSongs.addEventListener('click', (e) => {
			let songsDiv = e.target.closest('.songs');
			if (!songsDiv) {
				return;
			}
			this.getSongs.querySelectorAll('.songs').forEach((songs) => {
				songs.classList.remove('get-songs-selected');
			});
			songsDiv.classList.add('get-songs-selected');
		});
		this.getSongs.addEventListener('dblclick', (e) => {
			let songsDiv = e.target.closest('.songs');
			if (!songsDiv) {
				return;
			}
			musicPlayer.fetchMusic(songsDiv.dataset.id);
			// 这一堆children[0]其实就是双击音乐后，要放的音乐名字变红以及出现小喇叭标志，这么写就省得获取元素了
			let trumpet = document.createElement('img');
			trumpet.src = './picture/icon/RedTrumpet_icon.png';
			trumpet.className = 'song-trumpet';
			this.getSongs.querySelectorAll('.songs').forEach((songs, i) => {
				songs.children[0].children[1].style.color = 'black';
				let Num = i + 1;
				if (i < 10) {
					Num = `0${i + 1}`;
				}
				songs.children[0].children[0].children[0].innerText = Num;

				if (songs.children[0].children[0].children[0].children[0]) {
					songs.children[0].children[0].children[0].children[0].remove();
				}
			});
			songsDiv.children[0].children[0].children[0].innerText = '';
			songsDiv.children[0].children[0].children[0].insertAdjacentElement('beforeEnd', trumpet);
			songsDiv.children[0].children[1].style.color = '#ec4141';
		});

		// 播放全部歌曲功能
		this.playAllSongs.addEventListener('click', () => {
			let allSongsList = [];
			this.getSongs.querySelectorAll('.songs').forEach((songs) => {
				allSongsList.push(songs.dataset.id);
			});
			musicPlayer.setMusicList(allSongsList);
		});
	};

	#getInterestedSinger = async (singerId) => {
		let message1 = await fetch(`${API.url}${API.getArtistDetail}?id=${singerId}`);
		let Data1 = await message1.json();

		let singerMessage = {
			singerImg: Data1.data.artist.cover,
			singerName: Data1.data.artist.name,
			singerFans: 'cant get',
			singerMusicSize: Data1.data.artist.musicSize,
		};
		return singerMessage;
	};

	#renderSongTime = async (songId) => {
		let allSongsDOM = document.querySelectorAll('.songs');

		for (let i = 0; i < allSongsDOM.length; i++) {
			let res = await fetch(`${API.url}${API.getUrlBySongId}?id=${songId[i]}`);
			let data = await res.json();

			let time = this.#timeFormat(parseInt(data.data[0].time / 1000));

			allSongsDOM[i].querySelector('.songs-time').innerHTML = time;
		}
	};

	#timeFormat = (time) => {
		let hour = Math.floor(time / 3600);
		let minute = Math.floor((time - hour * 3600) / 60);
		let second = Math.floor(time - hour * 3600 - minute * 60);

		if (second < 10) {
			second = `0${second}`;
		}
		if (minute < 10) {
			minute = `0${minute}`;
		}
		if (hour < 10) {
			hour = `0${hour}`;
		}

		if (hour == 0) {
			return `${minute}:${second}`;
		}
		return `${hour}:${minute}:${second}`;
	};

	delete = () => {
		let dD = document.querySelector('.search-message-body');
		dD.innerHTML = '';
		dD.remove();
		this.searchMainCSS.remove();
	};
}
