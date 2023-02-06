let cssFile = ['../css/mainPage/mainPage.css', '../css/mainPage/mainPageHeader.css', '../css/mainPage/mainPageLeft.css', '../css/mainPage/mainPageFooter.css', '../css/search/hotSearch.css', '../css/mainPage/leaderBoaed.css'];

let head = document.querySelector('head');

function addFile() {
	for (let i = 0; i < cssFile.length; i++) {
		let cssFileText = `<link rel="stylesheet" href="${cssFile[i]}">`;
		head.insertAdjacentHTML('beforeEnd', cssFileText);
	}
}
addFile();
