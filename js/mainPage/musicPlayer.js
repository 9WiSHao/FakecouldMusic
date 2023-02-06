import { API } from '../API.js';

export class MusicPlayer {
	constructor(musicId) {
		this.#musicId = musicId;
		this.headDOM = document.querySelector('head');
		this.mainFooterDOM = document.querySelector('.main-footer');
		// 渲染HTML主干并且添加css样式文件
		this.#renderHTML();
		// 初始化DOM
		this.#init();
		// 获取音乐数据，货取完了之后同时渲染页面，为按钮添加事件
		this.fetchMusic(this.#musicId);
	}

	#renderHTML = () => {
		this.mainFooterDOM.children[0].innerHTML = `
        <div class="player-details">
            <img src="../../picture/icon/loading_player.png" alt="" />
        </div>
        <div class="player-song-message">
            <div class="player-song-message-up">
                <div class="player-song-name">loading...</div>
                <div class="player-love"><img src="../../picture/icon/loveMusic_icon.png" alt="" /></div>
            </div>
            <div class="player-song-artist">loading...</div>
        </div>
        `;
		this.mainFooterDOM.children[1].innerHTML = `
        <audio class="shinuchi" src=""></audio>
        <div class="player-function">
            <div class="single-loop"><img src="../../picture/icon/oneSongLoop_icon.png" alt="" /></div>
            <div class="last-song"><img src="../../picture/icon/lastSong_icon.png" alt="" /></div>
            <div class="playAndPause" title="播放/暂停"><img src="../../picture/icon/play_icon.png" alt="播放" /></div>
            <div class="next-song"><img src="../../picture/icon/nextSong_icon.png" alt="" /></div>
            <div class="song-lyrics">词</div>
        </div>
        <div class="player-progress">
            <div class="current-playback-time">00:00</div>
            <div class="progress-bar">
                <div class="playing-bar">
                    <div class="progress-bar-circle"></div>
                </div>
                <div class="buffered-bar"></div>
                <div class="background-bar"></div>
            </div>
            <div class="song-time">00:00</div>
        </div>
        `;
		this.mainFooterDOM.children[2].innerHTML = `
        <div class="player-other-function">
            <div class="player-volume">
                <img src="../../picture/icon/volume_icon.png" alt="" />
                <div class="volume-controller">
                    <div class="volume-controller-body">
                        <div class="volume-controller-bar-position">
                            <div class="volume-controller-bar">
                                <div class="volume-controller-circle"></div>
                            </div>
                            <div class="volume-controller-background"></div>
                        </div>
                    </div>
                    <div class="volume-controller-triangle"></div>
                </div>
            </div>
            <div class="player-list"><img src="../../picture/icon/playList_icon.png" alt="" /></div>
        </div>
        `;
		this.headDOM.insertAdjacentHTML('beforeEnd', `<link rel="stylesheet" href="../../css/mainPage/musicPlayer.css" />`);
	};
	// 绑定DOM并设置按钮事件
	#init = () => {
		this.audioDOM = document.querySelector('.shinuchi');
		this.playAndPauseDOM = document.querySelector('.playAndPause');
		this.lastSongDOM = document.querySelector('.last-song');
		this.nextSongDOM = document.querySelector('.next-song');
		this.volumeImgDOM = document.querySelector('.player-volume img');

		this.playingProgressDOM = document.querySelector('.playing-bar');
		this.progressBarDOM = document.querySelector('.progress-bar');
		this.progressBarCircleDOM = document.querySelector('.progress-bar-circle');
		this.bufferedBarDOM = document.querySelector('.buffered-bar');

		this.volumeControllerBarPositionDOM = document.querySelector('.volume-controller-bar-position');
		this.volumeControllerBarDOM = document.querySelector('.volume-controller-bar');
		this.volumeControllerCircleDOM = document.querySelector('.volume-controller-circle');

		this.currentPlaybackTimeDOM = document.querySelector('.current-playback-time');
		this.songTimeDOM = document.querySelector('.song-time');

		this.songNameDOM = document.querySelector('.player-song-name');
		this.songArtistDOM = document.querySelector('.player-song-artist');
		this.musicCoverDOM = document.querySelector('.player-details img');

		// 设置按钮
		this.#setButton();

		// 点击播放进度条，跳转到指定位置播放
		/**
        一定一定注意，这个监听事件一定写mousedown别写click，不然拖动小圆点鼠标放开的时候可能会触发这个事件，
        会给判断成一个e.offsetX非常小的点击,导致进度条弹回开始处,
        找了一个多小时才找到这个bug，快给我整玉玉了
        **/
		this.progressBarDOM.addEventListener('mousedown', this.#setProgress);
		// 拖动进度条圆圈，跳转到指定位置播放
		this.progressBarCircleDOM.addEventListener('mousedown', this.#setProgressByCircle);
		// 根据audio更新当前播放时间
		this.audioDOM.addEventListener('timeupdate', this.#updateTime);
		// 根据audio更新进度条
		this.audioDOM.addEventListener('timeupdate', this.#updateProgress);
		// 设置缓冲进度条
		this.audioDOM.addEventListener('progress', this.#updateBufferedProgress);
		this.audioDOM.addEventListener('seeking', this.#updateBufferedProgress);
		this.audioDOM.addEventListener('seeked', this.#updateBufferedProgress);

		// 点击设置音量
		this.volumeControllerBarPositionDOM.addEventListener('mousedown', this.#setVolume);
		// 拖动音量圆圈设置音量
		this.volumeControllerCircleDOM.addEventListener('mousedown', this.#setVolumeByCircle);

		// 播放结束，循环播放
		this.audioDOM.addEventListener('ended', () => {
			this.audioDOM.currentTime = 0;
			this.audioDOM.play();
		});
	};

	#musicId = '';
	#volumeNum = 0;
	#musicList = [1944660978, 1830411327, 1454946709];
	#musicListIndex = 0;

	#loadSong = (url, name, artist, cover) => {
		this.audioDOM.src = url;
		this.songNameDOM.innerText = name;
		this.songArtistDOM.innerText = artist;
		this.musicCoverDOM.src = cover;
	};
	// 格式化时间，返回时间字符串
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
	// 设置歌曲总时长
	#setTotalTime = () => {
		this.songTimeDOM.innerText = this.#timeFormat(this.audioDOM.duration);
	};
	// 设置当前播放时间
	#updateTime = () => {
		this.currentPlaybackTimeDOM.innerHTML = this.#timeFormat(this.audioDOM.currentTime);
	};
	// 按钮
	#setButton = () => {
		// 开始暂停键
		this.playAndPauseDOM.addEventListener('click', () => {
			if (this.audioDOM.paused) {
				this.audioDOM.play();
				this.playAndPauseDOM.children[0].src = '../../picture/icon/pause_icon.png';
			} else {
				this.audioDOM.pause();
				this.playAndPauseDOM.children[0].src = '../../picture/icon/play_icon.png';
			}
		});
		// 音量键
		this.volumeImgDOM.addEventListener('click', () => {
			if (this.audioDOM.volume != 0) {
				this.#volumeNum = this.audioDOM.volume;
				this.audioDOM.volume = 0;
				this.volumeControllerBarDOM.style.height = 0;
				this.volumeImgDOM.src = '../../picture/icon/volumeNone_icon.png';
			} else {
				this.audioDOM.volume = this.#volumeNum;
				this.volumeControllerBarDOM.style.height = `${this.#volumeNum * 100}%`;
				this.volumeImgDOM.src = '../../picture/icon/volume_icon.png';
			}
		});
		// 上一首
		this.lastSongDOM.addEventListener('click', () => {
			if (this.#musicList.length == 0) {
				return;
			}
			this.#musicListIndex--;
			if (this.#musicListIndex == -1) {
				this.#musicListIndex = this.#musicList.length - 1;
			}
			this.fetchMusic(this.#musicList[this.#musicListIndex]);
		});
		// 下一首
		this.nextSongDOM.addEventListener('click', () => {
			if (this.#musicList.length == 0) {
				return;
			}
			this.#musicListIndex++;
			if (this.#musicListIndex == this.#musicList.length) {
				this.#musicListIndex = 0;
			}
			this.fetchMusic(this.#musicList[this.#musicListIndex]);
		});
	};
	// 点击改变进度条
	#setProgress = (e) => {
		//此处本来是this.clientWidth，改成class后要修复this指向问题
		let width = this.progressBarDOM.clientWidth;
		let clickX = e.offsetX;
		let duration = this.audioDOM.duration;

		this.audioDOM.currentTime = (clickX / width) * duration;
	};

	// 为圆圈绑定按下事件
	#setProgressByCircle = (e) => {
		// 鼠标按下时，先移除进度条和时间的实时监听改变，不然拖动的时候老瞎改
		this.audioDOM.removeEventListener('timeupdate', this.#updateTime);
		this.audioDOM.removeEventListener('timeupdate', this.#updateProgress);
		// 给进度条点击改变进度的事件也移除了
		this.progressBarDOM.removeEventListener('mousedown', this.#setProgress);

		let event = e || window.event;
		// 进度条相对屏幕左边的位置，加上点击相对圆圈左边位置
		let progressLeft = event.clientX - this.progressBarCircleDOM.offsetLeft; //修复this指向问题

		let shouldSetTime = 0;
		// 为圆圈绑定拖动事件
		document.onmousemove = (event) => {
			event = event || window.event;
			// 进度条应该变化的长度，等于圆圈到进度条左面的长度（因为圆圈有个相对定位，所以-6）
			let progressX = event.clientX - progressLeft + 6;
			// 拖动超出进度条范围时，就停止拖动
			if (progressX <= 0) {
				progressX = 0;
			} else if (progressX >= this.progressBarDOM.clientWidth) {
				progressX = this.progressBarDOM.clientWidth;
			}
			// 设置进度条的长度
			this.playingProgressDOM.style.width = `${progressX}px`;
			// 拖动的实时设置时间
			this.currentPlaybackTimeDOM.innerHTML = this.#timeFormat((progressX / this.progressBarDOM.clientWidth) * this.audioDOM.duration);
			shouldSetTime = (progressX / this.progressBarDOM.clientWidth) * this.audioDOM.duration;
		};
		// 鼠标抬起时，取消拖动事件，并设置拖动结尾的进度为audio的进度
		document.onmouseup = () => {
			// 设置audio的进度
			this.audioDOM.currentTime = shouldSetTime;
			// 移除拖动事件
			document.onmousemove = null;
			document.onmouseup = null;
			// 重新绑定进度条和时间的实时监听改变
			this.audioDOM.addEventListener('timeupdate', this.#updateTime);
			this.audioDOM.addEventListener('timeupdate', this.#updateProgress);
			this.progressBarDOM.addEventListener('mousedown', this.#setProgress);
		};
	};
	// 更新进度条
	#updateProgress = (e) => {
		let duration = e.target.duration;
		let currentTime = e.target.currentTime;

		let progressPercent = (currentTime / duration) * 100;
		this.playingProgressDOM.style.width = `${progressPercent}%`;
	};
	// 缓冲进度条
	#updateBufferedProgress = () => {
		// 本来来说，打断了的缓冲是会有很多段的，但是一个mp3文件能有多大，实时分段还得用canvans太麻烦，所以就把最后一段的结尾当总缓冲进度得了
		let buffered = this.audioDOM.buffered;
		let bufferedTime = buffered.end(buffered.length - 1);
		let duration = this.audioDOM.duration;
		let bufferedPercent = (bufferedTime / duration) * 100;

		this.bufferedBarDOM.style.width = `${bufferedPercent}%`;
	};
	// 点击设置音量
	#setVolume = (e) => {
		let height = this.volumeControllerBarPositionDOM.clientHeight; // 此处修复this指向问题
		let clickYb = e.target.clientHeight - e.offsetY;

		this.#volumeNum = clickYb / height;
		this.audioDOM.volume = this.#volumeNum;
		this.volumeControllerBarDOM.style.height = `${this.#volumeNum * 100}%`;
	};
	// 拖动小球设置音量
	#setVolumeByCircle = (e) => {
		this.volumeControllerBarPositionDOM.removeEventListener('mousedown', this.#setVolume);

		let event = e || window.event;
		// 进度条相对屏幕下边的位置，加上点击相对圆圈下边位置
		// 等于(点击位置到屏幕下边界的长度)-(圆圈下边距到进度条底部的长度)
		let progressBottom = window.innerHeight - event.clientY - (this.volumeControllerCircleDOM.offsetParent.clientHeight - this.volumeControllerCircleDOM.offsetTop - this.volumeControllerCircleDOM.offsetHeight); // BOM没给offsetBottom那只能自己算。。。// 然后还得修复this指向问题

		document.onmousemove = (event) => {
			event = event || window.event;
			// 进度条应该变化的下边距
			let progressY = window.innerHeight - event.clientY - progressBottom + 6;

			if (progressY <= 0) {
				progressY = 0;
			} else if (progressY >= this.volumeControllerBarPositionDOM.clientHeight) {
				progressY = this.volumeControllerBarPositionDOM.clientHeight;
			}
			this.#volumeNum = progressY / this.volumeControllerBarPositionDOM.clientHeight;
			this.audioDOM.volume = this.#volumeNum;

			this.volumeControllerBarDOM.style.height = `${progressY}px`;
		};

		document.onmouseup = () => {
			document.onmousemove = null;
			document.onmouseup = null;
			this.volumeControllerBarPositionDOM.addEventListener('mousedown', this.#setVolume);
		};
	};

	setMusicList = (musicIdArray) => {
		this.#musicList = musicIdArray;
		this.#musicListIndex = 0;
	};

	fetchMusic = async (musicId) => {
		try {
			this.#musicId = musicId;

			let musicmessage1 = await fetch(`${API.url}${API.getUrlBySongId}?id=${musicId}`);
			let musicDate1 = await musicmessage1.json();

			let musicmessage2 = await fetch(`${API.url}${API.getSongDetail}?ids=${musicId}`);
			let musicDate2 = await musicmessage2.json();
			let artist = musicDate2.songs[0].ar[0].name;
			if (musicDate2.songs[0].ar[1] != undefined) {
				artist += ` / ${musicDate2.songs[0].ar[1].name}`;
			}

			let song = {
				url: musicDate1.data[0].url,
				name: musicDate2.songs[0].name,
				artistAll: artist,
				cover: musicDate2.songs[0].al.picUrl,
			};

			// 加载歌曲基本信息
			this.#loadSong(song.url, song.name, song.artistAll, song.cover);
			this.audioDOM.addEventListener('canplay', this.#setTotalTime);
		} catch (err) {
			console.log(err);
		}
	};
}
