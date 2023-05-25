import "./style.css";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const board: any = [];
const bgm = document.createElement("audio");
const complete = document.createElement("audio");
const drop = document.createElement("audio");
let rotatedShape;

bgm.setAttribute("src", "../public/bgm.mp3");
bgm.muted = true;

complete.setAttribute("src", "../public/complete.mp3");
complete.muted = true;

drop.setAttribute("src", "../public/drop.mp3");
drop.muted = true;

for (let row = 0; row < BOARD_HEIGHT; row++) {
	board[row] = [];
	for (let col = 0; col < BOARD_WIDTH; col++) {
		board[row][col] = 0;
	}
}
