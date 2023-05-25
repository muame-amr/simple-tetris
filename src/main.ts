import "./style.css";
import { Tetrominoes } from "./Tetrominoes";

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

const randomizeTetromino = () => {
	let idx = Math.floor(Math.random() * Tetrominoes.length);
	let tetromino = Tetrominoes[idx];
	return {
		shape: tetromino.shape,
		color: tetromino.color,
		row: 0,
		col: Math.floor(Math.random() * (BOARD_WIDTH - tetromino.shape[0].length)),
	};
};

let currTetromino = randomizeTetromino();
let currGhostTetromino;

const spawnTetromino = () => {
	let { shape, color, row, col } = currTetromino;

	for (let r = 0; r < shape.length; r++) {
		for (let c = 0; c < shape[r].length; c++) {
			if (shape[r][c]) {
				const block = document.createElement("div");
				block.classList.add("block");
				block.style.cssText =
					`backgroundColor: ${color}` +
					`top: ${(row + r) * 24}px` +
					`left: ${(col + c) * 24}px`;
				block.setAttribute("id", `block-${row + r} - ${col + c}`);
				document.getElementById("game_board")?.appendChild(block);
			}
		}
	}
};
