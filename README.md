# WebFrontEnd-winter-homework

前端寒假考核代码

### web 单页面应用拟网易云 PC 客户端

##### 功能

- 音乐播放器，可拖动调节进度，音量，可以上一曲下一曲（临时储存听过的音乐，默认放了三首歌）
- 首页轮播图，歌单可以点击跳转至对应歌单，单曲就直接播放，活动就跳转至官方活动网页
- 首页推荐歌单，点击可进入对应歌单
- 首页点击可切换至排行榜
- 搜索功能，输入后按回车或者点放大镜能搜索
- 搜索界面，双击能播放对应歌曲
- 热搜，点击搜索对应关键字
- 歌单，从首页推荐歌单点击进入
- 登录界面，可调接口发验证码，但是由于接口一直报错所以没做登录后的相关功能（获取不到 cookie，一直报-462，麻了）
- 搜索界面与歌单界面的全部播放，点击能在播放器切换上一曲下一曲

全部功能都封装在 class 里，前进后退直接调用的浏览器前进后退，hash 路由实现
