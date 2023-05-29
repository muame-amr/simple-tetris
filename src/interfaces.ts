export interface Tetromino {
	shape: number[][];
	color: string;
	row?: number | undefined;
	col?: number | undefined;
}
