import { SIZE } from "../common/globals.ts";
import { $$, Datex } from "unyt_core";
import { Array2d } from "common/Array2d.ts";
import { Matrix } from './Matrix.ts';
import { UIX } from "uix/uix.ts";
import { Homepage } from '../common/Homepage.tsx';

const scheduler = new Datex.UpdateScheduler(20);
Datex.Compiler.SIGN_DEFAULT = false;

export const matrix = await lazyEternalVar("matrix") ?? $$(
	new Array2d(SIZE.width, SIZE.height)
);

scheduler.addPointer(matrix.data);

Matrix.drawCenterArea(matrix);
Matrix.drawQRCode(matrix);


export const areaMap = eternal ?? $$(new Map<Datex.Endpoint, number>());

export async function getAreaIndex() {
	const endpoint = datex.meta?.sender;
	if (!endpoint) return -1;
	if (!areaMap.has(endpoint)) areaMap.set(endpoint, Math.max(...areaMap.values(), 0) + 1)
	return await areaMap.get(endpoint);
}

UIX.Theme.setMode("dark");
export default {
	'/startupsued': null,
	'*': UIX.renderStatic(new Homepage())
} satisfies UIX.Entrypoint;