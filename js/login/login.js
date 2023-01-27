import { API } from '../API.js';

export class Login {
	constructor() {
		this.bodyDOM = document.querySelector('body');
		this.headDOM = document.querySelector('head');
		this.#renderHTML();
		this.#inint();
		this.#buttonAdd();
	}
	// 通过js引入html页面
	#renderHTML = () => {
		// 引入html主干
		this.bodyDOM.insertAdjacentHTML(
			'afterBegin',
			`
        <div class="login-border">
            <div class="login-header">
                <div class="login-top">
                    <div class="login-top-left">
                        <img src="../../picture/icon/qrcode_login_icon.png" class="login-qrcode" />
                        <div class="login-qrcode-login-dialog">
                            <div class="login-triangle1"></div>
                            <div class="login-qrcode-login-text">扫码登录更安全</div>
                        </div>
                    </div>
                    <div class="login-top-right">
                        <img src="../../picture/icon/X_login_icon.png" />
                    </div>
                </div>
                <div class="login-logo-wy">
                    <img src="../../picture/icon/logowy_login_icon.png" />
                </div>
            </div>
            <div class="login-middle">
                <div class="login-input-box" cellspacing="0">
                    <div class="login-input-box-up">
                        <div class="login-phone-area">
                            <div class="login-icon-phone">
                                <img src="../../picture/icon/phone_login_icon.png" />
                            </div>
                            <div class="login-p86">+86</div>
                            <div class="login-triangle2"></div>
                        </div>
                        <div class="login-phone-number">
                            <input type="text" placeholder="请输入手机号" value="" />
                        </div>
                    </div>
                    <div class="login-input-box-down">
                        <div class="login-password">
                            <img src="../../picture/icon/lock_login_icon.png" />
                            <input type="text" placeholder="请输入密码" value="" />
                        </div>
                        <div class="login-sms">
                            <img src="../../picture/icon/password_login_icon.png" alt="" />
                            <input type="text" placeholder="请输入验证码" value="" />
                            <div class="login-getsms">获取验证码</div>
                        </div>
                    </div>
                </div>
                <div class="login-error"></div>
                <div class="login-success"></div>
                <div class="login-input-others">
                    <div class="login-input-others-left">
                        <input type="checkbox" />
                        <div>自动登录</div>
                    </div>
                    <div class="login-input-others-right">
                        <div class="login-forgetpassword">忘记密码</div>
                        <div class="login-line1"></div>
                        <div class="login-alternative">验证码登录</div>
                    </div>
                </div>
            </div>
            <div class="login-button">
                <div class="login-loginbutton">登&nbsp录</div>
                <div class="login-registered">注册</div>
            </div>
            <div class="login-others">
                <div class="login-othericon">
                    <img src="../../picture/icon/wechat_login_icon.png" alt="大且丑" />
                    <img src="../../picture/icon/qq_login_icon.png" alt="南极贱畜" />
                    <img src="../../picture/icon/weibo_login_icon.png" alt="粪坑" />
                    <img src="../../picture/icon/wy_login_icon.png" alt="猪场" />
                </div>
                <div class="login-clause">
                    <input type="checkbox" />
                    <span>同意</span>
                    <a href="https://st.music.163.com/official-terms/service">《服务条款》</a>
                    <a href="https://st.music.163.com/official-terms/privacy">《隐私政策》</a>
                    <a href="https://st.music.163.com/official-terms/children">《儿童隐私政策》</a>
                </div>
            </div>
        </div>
            `
		);

		// 引入css
		this.headDOM.insertAdjacentHTML(
			'beforeEnd',
			`
        <link rel="stylesheet" href="../../css/login/login.css" />
            `
		);
	};

	#inint = () => {
		this.loginButtonDOM = document.querySelector('.login-loginbutton');
		this.loginPhoneNumberDOM = document.querySelector('.login-phone-number input');
		this.loginPasswordInputDOM = document.querySelector('.login-password input');
		this.loginClauseDOM = document.querySelector('.login-clause input');
		this.loginBorderDOM = document.querySelector('.login-border');
		this.loginErrorDOM = document.querySelector('.login-error');
		this.loginSuccessDOM = document.querySelector('.login-success');
		this.loginAlternativeDOM = document.querySelector('.login-alternative');
		this.loginPasswordDOM = document.querySelector('.login-password');
		this.loginSmsDOM = document.querySelector('.login-sms');
		this.loginSmsInputDOM = document.querySelector('.login-sms input');
		this.loginGetsmsDOM = document.querySelector('.login-getsms');
		this.loginBorderDOM = document.querySelector('.login-border');
		this.loginEXitDOM = document.querySelector('.login-top-right img');
	};

	#loginFetchByPassword = async () => {
		let loginPhoneNumber = this.loginPhoneNumberDOM.value;
		let loginPassword = this.loginPasswordInputDOM.value;
		let message = await fetch(`${API.url}${API.loginByCellphone}?phone=${loginPhoneNumber}&password=${loginPassword}`, {
			method: 'GET',
		});
		let data = await message.json();
		console.log(data);
		// 麻麻的，后端登录接口坏了，报错-462，已经提issue了，
		// 计划先直接搞cookie登录写后面的，正常登录逻辑以后再写
	};
	// 点击获取验证码后的倒计时
	#loginBySms_reset = () => {
		this.loginGetsmsDOM.style.display = 'none';
		this.loginSmsDOM.insertAdjacentHTML('beforeend', '<div class="login-getsms-reset">60s后再次获取</div>');
		let loginGetsmsDOM_reset = document.querySelector('.login-getsms-reset');
		let time = 59;
		let contdown = setInterval(() => {
			loginGetsmsDOM_reset.textContent = `${time}s后再次获取`;
			if (time == 0) {
				clearInterval(contdown);
				loginGetsmsDOM_reset.remove();
				this.loginGetsmsDOM.style.display = 'block';
			}
			time--;
		}, 1000);
	};
	// 发送验证码
	#loginFetchBySms_send = async () => {
		let loginPhoneNumber = this.loginPhoneNumberDOM.value;
		let message = await fetch(`${API.url}${API.getLoginCaptcha}?phone=${loginPhoneNumber}`, {
			method: 'GET',
		});
		let data = await message.json();
		if (data.code == 400) {
			this.loginErrorDOM.innerHTML = '当天发送验证码的条数超过限制';
			return;
		}
		if (data.code == 200) {
			this.loginSuccessDOM.innerHTML = '验证码已通过短信发送';
			this.loginSuccessDOM.setTimeout(() => {
				this.loginSuccessDOM.innerHTML = '';
			}, 5000);
			return;
		}
	};
	// 验证验证码
	#loginFetchBySms_verify = async () => {
		let loginPhoneNumber = this.loginPhoneNumberDOM.value;
		let loginSmsInput = this.loginSmsInputDOM.value;
		let message1 = await fetch(`${API.url}${API.verifyLoginCaptcha}?phone=${loginPhoneNumber}&captcha=${loginSmsInput}`, {
			method: 'GET',
		});
		let data1 = await message1.json();
		if (data1.code == 503) {
			this.loginErrorDOM.innerHTML = '验证码错误';
			return;
		}
		if (data1.code == 200) {
			let message2 = await fetch(`${API.url}${API.loginByCellphone}?phone=${loginPhoneNumber}&captcha=${loginSmsInput}`, {
				method: 'GET',
			});
			let data2 = await message2.json();
			console.log(data2);
			// 麻麻的，后端登录接口坏了，报错-462，已经提issue了，
			// 计划先直接搞cookie登录写后面的，正常登录逻辑以后再写
			return;
		}
	};

	// 密码登录的简单验证部分
	#loginByPassword = () => {
		if (this.loginPhoneNumberDOM.value == '') {
			this.loginErrorDOM.innerHTML = '请输入手机号';
			return;
		}
		if (this.loginPasswordInputDOM.value == '') {
			this.loginErrorDOM.innerHTML = '请输入登录密码';
			return;
		}
		// 简单判断手机号格式是否正确
		if (this.loginPhoneNumberDOM.value.match(/^(?:(?:\+|00)86)?1\d{10}$/) == null) {
			this.loginErrorDOM.innerHTML = '请输入11位数字的手机号';
			return;
		}
		this.loginErrorDOM.innerHTML = '';
		this.#loginFetchByPassword();
	};
	// 验证码登录的简单验证部分
	#loginBySms = () => {
		if (this.loginPhoneNumberDOM.value == '') {
			this.loginErrorDOM.innerHTML = '请输入手机号';
			return;
		}
		if (this.loginSmsInputDOM.value == '') {
			this.loginErrorDOM.innerHTML = '请输入验证码';
			return;
		}
		// 简单判断手机号格式是否正确
		if (this.loginPhoneNumberDOM.value.match(/^(?:(?:\+|00)86)?1\d{10}$/) == null) {
			this.loginErrorDOM.innerHTML = '请输入11位数字的手机号';
			return;
		}
		if (document.querySelector('.login-getsms-reset') == null) {
			this.loginErrorDOM.innerHTML = '请先获取验证码';
			return;
		}
		this.loginErrorDOM.innerHTML = '';
		this.#loginFetchBySms_verify();
	};
	// 弹出同意协议的提示
	#loginHint = () => {
		let loginHintDOM = document.createElement('div');
		loginHintDOM.className = 'login-hint-create';
		loginHintDOM.innerHTML = '请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》';
		this.loginBorderDOM.append(loginHintDOM);
		setTimeout(() => {
			loginHintDOM.classList.add('login-hint');
		}, 0);
		setTimeout(() => {
			loginHintDOM.classList.add('login-hint-remove');
		}, 1600);
		setTimeout(() => {
			loginHintDOM.remove();
		}, 2200);
	};
	// 为按钮绑定监听器
	#buttonAdd = () => {
		// 点击登录按钮的监听器
		this.loginButtonDOM.addEventListener('click', () => {
			// 必须先勾选同意协议才能进行下面的
			if (this.loginClauseDOM.checked == false) {
				// 没有提示的话就创建提示
				if (document.querySelector('.login-hint') == null) {
					this.#loginHint();
				}
				return;
			}
			// 判断是密码登录还是验证码登录
			getComputedStyle(this.loginPasswordDOM).display == 'flex' ? this.#loginByPassword() : this.#loginBySms();
		});

		// 点击获取验证码的监听器
		this.loginGetsmsDOM.addEventListener('click', () => {
			// 必须先勾选同意协议才能进行下面的
			if (this.loginClauseDOM.checked == false) {
				// 没有提示的话就创建提示
				if (document.querySelector('.login-hint') == null) {
					this.#loginHint();
				}
				return;
			}
			// 简单判断手机号格式是否正确
			if (this.loginPhoneNumberDOM.value.match(/^(?:(?:\+|00)86)?1\d{10}$/) == null) {
				this.loginErrorDOM.innerHTML = '请输入11位数字的手机号';
				return;
			}
			// 清空错误提示并且使得获取验证码按钮变成倒计时
			this.loginErrorDOM.innerHTML = '';
			this.#loginBySms_reset();
			this.#loginFetchBySms_send();
		});

		// 点击切换登录方式的监听器
		this.loginAlternativeDOM.addEventListener('click', () => {
			if (getComputedStyle(this.loginPasswordDOM).display == 'flex') {
				this.loginPasswordDOM.style.display = 'none';
				this.loginSmsDOM.style.display = 'flex';
				this.loginAlternativeDOM.innerHTML = '密码登录';
			} else {
				this.loginPasswordDOM.style.display = 'flex';
				this.loginSmsDOM.style.display = 'none';
				this.loginAlternativeDOM.innerHTML = '验证码登录';
			}
		});

		// 点击退出登录页面的监听器
		this.loginEXitDOM.addEventListener('click', () => {
			this.loginBorderDOM.remove();
		});
	};
}
