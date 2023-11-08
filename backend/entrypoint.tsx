import { SIZE } from "common/globals.ts";
import { $$, Datex } from "unyt_core";
import { Array2d } from "common/Array2d.ts";
import { Matrix } from './Matrix.ts';
import { UIX } from "uix/uix.ts";
import { Homepage } from 'common/Homepage.tsx';
import { Path } from 'uix/utils/path.ts';
import { Area } from 'common/AreaHandler.ts';

const scheduler = new Datex.UpdateScheduler(20);
Datex.Compiler.SIGN_DEFAULT = false;

export const matrix = await lazyEternalVar("matrix") ?? $$(
	new Array2d(SIZE.width, SIZE.height)
);

scheduler.addPointer(matrix.data);

Matrix.drawCenterArea(matrix);
Matrix.drawQRCode(matrix);

Matrix.drawImage(matrix, new Path("assets/logo.png"), 1);
Matrix.drawImage(matrix, new Path("assets/logo.png"), 3);
Matrix.drawImage(matrix, new Path("assets/logo.png"), 5);
Matrix.drawImage(matrix, new Path("assets/logo.png"), 7);


// Matrix.drawImage(matrix, new Path("assets/mushroom.png"), 2, 20);
// Matrix.drawImage(matrix, new Path("assets/pickaxe.png"), 4);
// Matrix.drawImage(matrix, new Path("assets/luigi.png"), 6)

for (let i=1; i<=21; i++)
	Matrix.drawImage(matrix, new Path(`assets/${i}.png`), i+8, [1, 3, 11, 12, 15, 16].includes(i) ? Area.size : 25);



export const areaMap = eternal ?? $$(new Map<Datex.Endpoint, number>());

areaMap.set(new Datex.Endpoint("@artwall"), 29);

export async function getAreaIndex() {
	const endpoint = datex.meta?.sender;
	if (!endpoint) return -1;
	if (!areaMap.has(endpoint)) areaMap.set(endpoint, Math.max(...areaMap.values(), 0) + 1)
	return await areaMap.get(endpoint);
}

UIX.Theme.setMode("dark");
export default {
	'/join': null,
	'*': UIX.renderStatic(new Homepage())
} satisfies UIX.Entrypoint;