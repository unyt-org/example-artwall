import { GameMap } from '../common/GameMap.ts';
import { QRCODE } from "../common/globals.ts";

export class Matrix {
	public static  drawQRCode(matrix: GameMap) {	
		const offsetX = Math.floor(matrix.width / 2 - QRCODE[0].length / 2);
		const offsetY = Math.floor(matrix.height / 2 - QRCODE.length / 2);

		for (let y=0; y<QRCODE.length; y++) {
			for (let x=0; x<QRCODE[y].length; x++) {
				const val = QRCODE[y][x] === 0 ? -2 : -1;
				const mX = x + offsetX;
				const mY = y + offsetY;
				matrix.set(mX, mY, val);
			}
		}
	}
	public static drawCenterArea(matrix: GameMap) {
		const size = 33;
		const offsetX = Math.floor(matrix.width / 2 - size / 2);
		const offsetY = Math.floor(matrix.height / 2 - size / 2);
		for (let y=0; y<size; y++)
			for (let x=0; x<size; x++)
				matrix.set(x + offsetX, y + offsetY, -100);
	}

}