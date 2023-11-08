import { Path } from "uix/utils/path.ts";
import { Array2d } from 'common/Array2d.ts';
import { QRCODE } from "common/globals.ts";
import * as jpegts from "https://deno.land/x/jpegts@1.1/mod.ts";
import * as pngs from "https://deno.land/x/pngs@0.1.1/mod.ts";

import { COLORS } from 'common/globals.ts';
import { Area } from 'common/AreaHandler.ts';

export class Matrix {
	public static drawQRCode(matrix: Array2d) {	
		const offsetX = Math.floor(matrix.width / 2 - QRCODE[0].length / 2);
		const offsetY = Math.floor(matrix.height / 2 - QRCODE.length / 2);

		for (let y=0; y<QRCODE.length; y++) {
			for (let x=0; x<QRCODE[y].length; x++) {
				const val = QRCODE[y][x] === 0 ? 0 : -2;
				const mX = x + offsetX;
				const mY = y + offsetY;
				matrix.set(mX, mY, val);
			}
		}
	}

	public static colorDelta(rgbA: {r: number, g: number, b: number}, rgbB: {r: number, g: number, b: number}) {
		const labA = Matrix.rgb2lab([rgbA.r, rgbA.g, rgbA.b]);
		const labB = Matrix.rgb2lab([rgbB.r, rgbB.g, rgbB.b]);
		const deltaL = labA[0] - labB[0];
		const deltaA = labA[1] - labB[1];
		const deltaB = labA[2] - labB[2];
		const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
		const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
		const deltaC = c1 - c2;
		let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
		deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
		const sc = 1.0 + 0.045 * c1;
		const sh = 1.0 + 0.015 * c1;
		const deltaLKlsl = deltaL / (1.0);
		const deltaCkcsc = deltaC / (sc);
		const deltaHkhsh = deltaH / (sh);
		const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
		return i < 0 ? 0 : Math.sqrt(i);
	}
	  
	public static rgb2lab(rgb: number[]) {
		let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
		r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
		g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
		b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
		x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
		y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
		z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
		x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
		y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
		z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
		return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
	}

	public static hexToRgb(hex: string) {
		return {
			r: parseInt(hex.substring(0, 2), 16),
			g: parseInt(hex.substring(2, 4), 16),
			b: parseInt(hex.substring(4, 6), 16)
		}
	}

	public static drawCenterArea(matrix: Array2d) {
		const size = 33;
		const offsetX = Math.floor(matrix.width / 2 - size / 2);
		const offsetY = Math.floor(matrix.height / 2 - size / 2);
		for (let y=0; y<size; y++) {
			for (let x=0; x<size; x++) {
				matrix.set(x + offsetX, y + offsetY, -100);
			}
		}			
	}

	public static clear(matrix: Array2d, index = 0) {
		const position = Area.calculatePosition(index);
		for (let y=0; y<Area.size; y++)
			for (let x=0; x<Area.size; x++)
				matrix.set(position.x + x, position.y + y, 0);
	}

	public static async drawImage(matrix: Array2d, src: Path, index = 0, width = Area.size) {
		const raw = await Deno.readFile(src.pathname);
		const isJpg = src.toString().endsWith(".jpg") || src.toString().endsWith(".jpeg");
		this.clear(matrix, index);
		const data = isJpg ? jpegts.decode(raw) : pngs.decode(raw);
		let dX = width,
			dY = Math.ceil((data.height / data.width) * width);
		if (dY > dX) {
			dY = width,
			dX = Math.ceil((data.width / data.height) * width);
		}
		const getPixel = (x: number, y: number) => {
			if (isJpg) return (data as jpegts.Image).getPixel(x, y);
			const image = (data as pngs.DecodeResult).image;
			const hasAlpha = (data as pngs.DecodeResult).colorType === 6;
			const index = (Math.floor(y) * data.width + Math.floor(x)) * (hasAlpha ? 4 : 3)
			return {
				r: image[index],
				g: image[index + 1],
				b: image[index + 2],
				a: hasAlpha ? image[index + 3] : 1
			}
		}
		const position = Area.calculatePosition(index);
		const offset = {
			x: Math.floor(Area.size/2 - dX/2),
			y: Math.floor(Area.size/2 - dY/2)
		}
		for (let y=0; y<dY; y++) {
			for (let x=0; x<dX; x++) {
				const imgX = Math.floor(x * (data.width / dX));
				const imgY = Math.floor(y * (data.height / dY));
				const {r, g, b, a} = getPixel(imgX, imgY);
				if (a < 0.2) {
					matrix.set(x+position.x+offset.x, y+position.y+offset.y, 0);
					continue;
				}
				const list = COLORS.slice(1).map(c => this.colorDelta(this.hexToRgb(c.substring(1)), {r, g, b}))
				const index = list.indexOf(Math.min(...list)) + 1;
				matrix.set(x+position.x+offset.x, y+position.y+offset.y, index);
			}
		}
	}
}