import { type GameView } from './GameView.tsx';
import { Point, SIZE, QRCODE, DIGITS } from "./globals.ts";

export class Area {
	private position: Point;
	private matrix: number[][];
	public static size = 33;

	constructor(matrix: number[][], index: number = 0) {
		this.position = this.calculatePosition(index + 1);
		this.matrix = matrix;
		this.drawNumber(this.center, index + 1);
	}

	public isInside(point: Point): boolean {
		return (point.y >= this.tl.y && point.x >= this.tl.x &&
			point.y < this.br.y && point.x < this.br.x);
	}

	public get isEmpty(): boolean {
		for (let y=this.tl.y; y<this.br.y; y++) {
			for (let x=this.tl.x; x<this.br.x; x++) {
				if (this.matrix[y][x] !== 0 && Math.abs(this.matrix[y][x]) !== Infinity)
					return false;
			}	
		}
		return true;
	}

	private drawNumber(position: Point, number: number) {
		const numberStr = number.toString();
		for (let index=0; index<numberStr.length; index++) {
			const digit = DIGITS[numberStr[index] as '0']
			for (let y=0; y<digit.length; y++)
				for (let x=0; x<digit[y].length; x++)
					this.matrix[position.y + y - 4][Math.floor(position.x + x + index*6 - (6*numberStr.length)/2)] = digit[y][x] ? Infinity : 0;
		}
	}


	public get size() {
		return Area.size;
	}

	private calculatePosition(index: number): Point {
		let x = 0;
		let y = 0;
		let i = 0;
		let k = 1;
		while (i < index) {
			for (let m = 0; m < k && i < index; m++)
				x++; i++;
			for (let n = 0; n < k && i < index; n++)
				y++; i++;
			k++;
			for (let m = 0; m < k && i < index; m++)
				x--; i++;
			for (let n = 0; n < k && i < index; n++)
				y--; i++;
			k++;
		}
		return {
			x: Math.floor(x*this.size + SIZE.width/2 - this.size/2),
			y: Math.floor(y*this.size + SIZE.height/2 - this.size/2)
		};
	}

	public get tl() {
		return this.position;
	}

	public get center() {
		return {
			x: Math.floor(this.position.x + Area.size/2),
			y: Math.floor(this.position.y + Area.size/2)
		};
	}

	public get br() {
		return {
			x: this.position.x + Area.size,
			y: this.position.y + Area.size
		};
	}
}

export default class AreaHandler {
	private game: GameView;
	constructor(game: GameView) {
		this.game = game;
		this.drawCenterArea();
		this.drawQRCode();
	}

	public areas: Array<Area> = [];
	public addArea(index: number): Area {
		const area = new Area(this.game.matrix, index);
		this.areas.push(area);
		return area;
	}

	private drawQRCode() {	
		const offsetX = Math.floor(this.game.matrix[0].length / 2 - QRCODE[0].length / 2);
		const offsetY = Math.floor(this.game.matrix.length / 2 - QRCODE.length / 2);

		for (let y=0; y<QRCODE.length; y++) {
			for (let x=0; x<QRCODE[y].length; x++) {
				const val = QRCODE[y][x] === 0 ? -2 : -1;
				const mX = x + offsetX;
				const mY = y + offsetY;
				this.game.matrix[mY][mX] = val;
			}
		}
	}

	private drawCenterArea() {
		const size = 33;
		const offsetX = Math.floor(this.game.matrix[0].length / 2 - size / 2);
		const offsetY = Math.floor(this.game.matrix.length / 2 - size / 2);
		for (let y=0; y<size; y++)
			for (let x=0; x<size; x++)
				this.game.matrix[y + offsetY][x + offsetX] = -Infinity;
	}
}