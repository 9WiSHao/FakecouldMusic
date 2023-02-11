import { API } from '../API.js';
import { musicPlayer } from '../mainPage/mainPage.js';

export class SongList {
	constructor(listId) {
		this.headDOM = document.querySelector('head');
		this.mainBodyRightMainDOM = document.querySelector('.main-body-right-main');

		this.#renderHTML();
		this.#init();
		this.#fetchSongList(listId);
	}

	#renderHTML = () => {
		this.mainBodyRightMainDOM.innerHTML = `
        <div class="songlist-body">
            <div class="songlist-header">
                <div class="songlist-header-left"><img src="./picture/icon/loading_player.png" alt="" /></div>
                <div class="songlist-header-right">
                    <div class="songlist-title">
                        <div class="songlist-title-icon">歌单</div>
                        <div class="songlist-title-name">Loading...</div>
                    </div>
                    <div class="songlist-creater">
                        <img src="./picture/icon/Akkarin.jpg" alt="" />
                        <div class="songlist-creater-name">Loading...</div>
                        <div class="songlist-creater-date">创建</div>
                    </div>
                    <div class="songlist-function">
                        <div class="songlist-function-setinlist">播放全部(添加到播放列表)</div>
                    </div>
                    <div class="songlist-tag">标签: Loading...</div>
                    <div class="songlist-message">
                        <div class="songlist-songnumber">歌曲: Loading...</div>
                        <div class="songlist-playcount">播放:Loading...</div>
                    </div>
                    <div class="songlist-detail">简介: Loading...</div>
                </div>
            </div>
            <div class="songlist-main">
                <div class="songlist-table">
                    <div class="songlist-table-songs songlist-table-selected">
                        歌曲列表
                        <span class="songlist-table-line"></span>
                    </div>
                </div>
                <div class="songlist-main-header">
                    <div>操作</div>
                    <div>标题</div>
                    <div>歌手</div>
                    <div>专辑</div>
                    <div>时长</div>
                </div>
                <div class="songlist-songs">
                </div>
            </div>
        </div>
        `;

		this.songListCSS = document.createElement('link');
		this.songListCSS.rel = 'stylesheet';
		this.songListCSS.href = './css/songList/songList.css';

		this.headDOM.appendChild(this.songListCSS);
	};

	#init = () => {
		this.songlistCoverDOM = document.querySelector('.songlist-header-left img');
		this.songlistTitleNameDOM = document.querySelector('.songlist-title-name');
		this.songlistCreaterImgDOM = document.querySelector('.songlist-creater img');
		this.songlistCreaterNameDOM = document.querySelector('.songlist-creater-name');
		this.songlistTagDOM = document.querySelector('.songlist-tag');
		this.songlistSongnumberDOM = document.querySelector('.songlist-songnumber');
		this.songlistPlaycountDOM = document.querySelector('.songlist-playcount');
		this.songlistDetailDOM = document.querySelector('.songlist-detail');

		this.songlistSongsDOM = document.querySelector('.songlist-songs');

		this.playAllSongs = document.querySelector('.songlist-function-setinlist');
	};

	#fetchSongList = async (id) => {
		let res1 = await fetch(`${API.url}${API.getListDetail}?id=${id}`);
		let data1 = await res1.json();

		let res2 = await fetch(`${API.url}${API.getListSongs}?id=${id}`);
		let data2 = await res2.json();

		let listHeaderObj = {
			listCover: data1.playlist.coverImgUrl,
			listName: data1.playlist.name,
			createrImg: data1.playlist.creator.avatarUrl,
			createrName: data1.playlist.creator.nickname,
			listTag: data1.playlist.tags.join(' / '),
			listSongnumber: data1.playlist.trackCount,
			listPlaycount: data1.playlist.playCount,
			listDetail: data1.playlist.description,
		};

		let songIdArr = [];
		for (let i = 0; i < data2.songs.length; i++) {
			songIdArr.push(data2.songs[i].id);
		}

		this.#renderSongList(listHeaderObj, data2);

		this.#renderSongTime(songIdArr);

		this.#setButtonAfter();
	};

	#renderSongList = (headerData, songsData) => {
		this.songlistCoverDOM.src = headerData.listCover;
		this.songlistTitleNameDOM.innerHTML = headerData.listName;
		this.songlistCreaterImgDOM.src = headerData.createrImg;
		this.songlistCreaterNameDOM.innerHTML = headerData.createrName;
		this.songlistTagDOM.innerHTML = `标签: ${headerData.listTag}`;
		this.songlistSongnumberDOM.innerHTML = `歌曲: ${headerData.listSongnumber}`;
		this.songlistPlaycountDOM.innerHTML = `播放: ${this.#playCountFormat(headerData.listPlaycount)}`;
		this.songlistDetailDOM.innerHTML = `简介: ${headerData.listDetail}`;

		for (let i = 0; i < songsData.songs.length; i++) {
			let num = i + 1;
			if (i < 10) {
				num = `0${num}`;
			}
			let singer = songsData.songs[i].ar[0].name;
			if (songsData.songs[i].ar.length > 1) {
				for (let j = 1; j < songsData.songs[i].ar.length; j++) {
					singer += ` / ${songsData.songs[i].ar[j].name}`;
				}
			}

			this.songlistSongsDOM.insertAdjacentHTML(
				'beforeend',
				`
		    <div class="songs" data-id="${songsData.songs[i].id}">
		        <div class="display1">
		            <div class="songs-number">${num}</div>
		            <div class="songs-love"><img src="" alt="" /></div>
		            <div class="songs-download"><img src="" alt="" /></div>
		        </div>
		        <div class="songs-name">${songsData.songs[i].name}</div>
		        <div class="songs-singer">${singer}</div>
		        <div class="songs-album">${songsData.songs[i].al.name}</div>
		        <div class="songs-time">loading...</div>
		    </div>
		    `
			);
		}
	};

	#renderSongTime = async (songId) => {
		let allSongsDOM = document.querySelectorAll('.songlist-songs .songs');

		for (let i = 0; i < allSongsDOM.length; i++) {
			let res = await fetch(`${API.url}${API.getUrlBySongId}?id=${songId[i]}`);
			let data = await res.json();

			let time = this.#timeFormat(parseInt(data.data[0].time / 1000));

			allSongsDOM[i].querySelector('.songs-time').innerHTML = time;
		}
	};

	#setButtonAfter = () => {
		this.songlistSongsDOM.addEventListener('click', (e) => {
			let songsDiv = e.target.closest('.songs');
			if (!songsDiv) {
				return;
			}
			this.songlistSongsDOM.querySelectorAll('.songs').forEach((songs) => {
				songs.classList.remove('songlist-songs-selected');
			});
			songsDiv.classList.add('songlist-songs-selected');
		});
		this.songlistSongsDOM.addEventListener('dblclick', (e) => {
			let songsDiv = e.target.closest('.songs');
			if (!songsDiv) {
				return;
			}
			musicPlayer.fetchMusic(songsDiv.dataset.id);
			// 双击音乐后，要放的音乐名字变红以及出现小喇叭标志，这么写就省得获取元素了
			let trumpet = document.createElement('img');
			trumpet.src = './picture/icon/RedTrumpet_icon.png';
			trumpet.className = 'song-trumpet';
			this.songlistSongsDOM.querySelectorAll('.songs').forEach((songs, i) => {
				songs.querySelector('.songs-name').style.color = 'black';
				let Num = i + 1;
				if (i < 10) {
					Num = `0${i + 1}`;
				}
				songs.querySelector('.songs-number').innerText = Num;

				if (songs.querySelector('song-trumpet')) {
					songs.querySelector('song-trumpet').remove();
				}
			});
			songsDiv.querySelector('.songs-number').innerText = '';
			songsDiv.querySelector('.songs-number').insertAdjacentElement('beforeEnd', trumpet);
			songsDiv.querySelector('.songs-name').style.color = '#ec4141';
		});
		this.playAllSongs.addEventListener('click', () => {
			let allSongsList = [];
			this.songlistSongsDOM.querySelectorAll('.songs').forEach((songs) => {
				allSongsList.push(songs.dataset.id);
			});
			musicPlayer.setMusicList(allSongsList);
		});
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
		this.mainBodyRightMainDOM.innerHTML = '';
		this.songListCSS.remove();
	};
}
