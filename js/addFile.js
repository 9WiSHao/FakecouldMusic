let cssFile = ['./css/mainPage/mainPage.css', './css/mainPage/mainPageHeader.css'];
let jsFile = ['./js/mainPage/mainPage.js'];

let head = document.querySelector('head');
let body = document.querySelector('body');

function addFile() {
	for (let i = 0; i < cssFile.length; i++) {
		let cssFileText = `<link rel="stylesheet" href="${cssFile[i]}">`;
		head.insertAdjacentHTML('beforeEnd', cssFileText);
		let jsFileText = `<script src="${jsFile[i]}" type="module"></script>`;
		body.insertAdjacentHTML('beforeEnd', jsFileText);
	}
}
addFile();
