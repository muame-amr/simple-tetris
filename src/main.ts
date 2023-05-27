import "./style.css";
import { Tetrominoes } from "./Tetrominoes";

/**
 * Game Config / Parameters
 */
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const GAME_SPEED = 500;

const board: any = [];
const bgm = document.createElement("audio");
const complete = document.createElement("audio");
const drop = document.createElement("audio");
let score: number = 0;
let rotatedShape: number[][];

bgm.setAttribute("src", "../public/bgm.mp3");
bgm.muted = true;

complete.setAttribute("src", "../public/complete.mp3");
complete.muted = true;

drop.setAttribute("src", "../public/drop.mp3");
drop.muted = true;

for (let i = 0; i < BOARD_HEIGHT; i++) {
	board[i] = [];
	for (let j = 0; j < BOARD_WIDTH; j++) {
		board[i][j] = 0;
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

const drawTetromino = () => {
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
				block.setAttribute("id", `block-${row + r}-${col + c}`);
				document.getElementById("game_board")?.appendChild(block);
			}
		}
	}
};

const eraseTetromino = () => {
	for (let i = 0; i < currTetromino.shape.length; i++) {
		for (let j = 0; j < currTetromino.shape[i].length; j++) {
			if (currTetromino.shape[i][j]) {
				let row = currTetromino.row + i;
				let col = currTetromino.col + j;
				let block = document.getElementById(`block-${row}-${col}`);

				if (block) {
					document.getElementById("game_board")?.removeChild(block);
				}
			}
		}
	}
};

const canTetrominoMove = (rowOffset: any, colOffset: any) => {
	for (let i = 0; i < currTetromino.shape.length; i++) {
		for (let j = 0; j < currTetromino.shape[i].length; ) {
			if (currTetromino.shape[i][j]) {
				let row = currTetromino.row + i + rowOffset;
				let col = currTetromino.col + j + colOffset;

				if (
					row >= BOARD_HEIGHT ||
					col < 0 ||
					col >= BOARD_WIDTH ||
					(row >= 0 && board[row][col] !== 0)
				)
					return false;
			}
		}
	}
	return true;
};

const canTetrominoRotate = () => {
	for (let i = 0; i < rotatedShape.length; i++) {
		for (let j = 0; j < rotatedShape[i].length; j++) {
			if (rotatedShape[i][j]) {
				let row = currTetromino.row + i;
				let col = currTetromino.col + j;

				if (
					row >= BOARD_HEIGHT ||
					col < 0 ||
					col >= BOARD_WIDTH ||
					(row >= 0 && board[row][col] !== 0)
				)
					return false;
			}
		}
	}
	return true;
};

const clearRows = () => {
	let rowsCleared = 0;

	for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
		let rowFilled = true;

		for (let x = 0; x < BOARD_WIDTH; x++) {
			if (board[y][x] === 0) {
				rowFilled = false;
				break;
			}
		}

		if (rowFilled) {
			complete.muted = false;
			complete.play();
			rowsCleared++;

			for (let yy = y; yy > 0; yy--) {
				for (let x = 0; x < BOARD_WIDTH; x++) {
					board[yy][x] = board[yy - 1][x];
				}
			}

			for (let x = 0; x < BOARD_WIDTH; x++) {
				board[0][x] = 0;
			}

			document.getElementById("game_board")!.innerHTML = "";
			for (let row = 0; row < BOARD_HEIGHT; row++) {
				for (let col = 0; col < BOARD_WIDTH; col++) {
					if (board[row][col]) {
						const block = document.createElement("div");
						block.classList.add("block");
						block.style.backgroundColor = board[row][col];
						block.style.top = row * 24 + "px";
						block.style.left = col * 24 + "px";
						block.setAttribute("id", `block-${row}-${col}`);
						document.getElementById("game_board")?.appendChild(block);
					}
				}
			}

			y++;
		}
	}

	return rowsCleared;
};

const lockTetromino = () => {
	for (let i = 0; i < currTetromino.shape.length; i++) {
		for (let j = 0; j < currTetromino.shape[i].length; j++) {
			if (currTetromino.shape[i][j] !== 0) {
				let row = currTetromino.row + i;
				let col = currTetromino.col + j;
				board[row][col] = currTetromino.color;
			}
		}
	}

	let rowsCleared = clearRows();
	if (rowsCleared) {
		score += rowsCleared * 10;
	}

	currTetromino = randomizeTetromino();
};

const rotateTetromino = () => {
	rotatedShape = [];
	for (let i = 0; i < currTetromino.shape[0].length; i++) {
		let row = [];
		for (let j = currTetromino.shape.length - i; j >= 0; j--) {
			row.push(currTetromino.shape[j][i]);
		}
		rotatedShape.push(row);
	}
	if (canTetrominoRotate()) {
		eraseTetromino();
		currTetromino.shape = rotatedShape;
		drawTetromino();

		moveGhostTetromino();
	}
};

const moveTetromino = (direction: string) => {
	let row = currTetromino.row;
	let col = currTetromino.col;

	switch (direction) {
		case "left": {
			if (canTetrominoMove(0, -1)) {
				eraseTetromino();
				col -= 1;
				currTetromino.col = col;
				currTetromino.row = row;
				drawTetromino();
			}
			break;
		}
		case "right": {
			if (canTetrominoMove(0, 1)) {
				eraseTetromino();
				col += 1;
				currTetromino.col = col;
				currTetromino.row = row;
				drawTetromino();
			}
			break;
		}
		default: {
			if (canTetrominoMove(1, 0)) {
				eraseTetromino();
				row++;
				currTetromino.col = col;
				currTetromino.row = row;
				drawTetromino();
			} else {
				lockTetromino();
			}
		}
	}

	moveGhostTetromino();
};

drawTetromino();
setInterval(moveTetromino, GAME_SPEED);

const moveGhostTetromino = () => {
	throw new Error("Function not implemented.");
};
