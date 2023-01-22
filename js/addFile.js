let cssFile = ['./css/mainPage/mainPage.css', './css/mainPage/mainPageHeader.css', './css/mainPage/mainPageLeft.css', './css/mainPage/mainPageFooter.css'];
let jsFile = ['./js/mainPage/mainPage.js'];

let head = document.querySelector('head');
let body = document.querySelector('body');

function addFile() {
	for (let i = 0; i < cssFile.length; i++) {
		let cssFileText = `<link rel="stylesheet" href="${cssFile[i]}">`;
		head.insertAdjacentHTML('beforeEnd', cssFileText);
	}
	for (let i = 0; i < jsFile.length; i++) {
		let jsFileText = `<script src="${jsFile[i]}" type="module"></script>`;
		body.insertAdjacentHTML('beforeEnd', jsFileText);
	}
}
addFile();
