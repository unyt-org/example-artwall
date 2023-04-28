import { SIZE } from "../common/globals.ts";
import { $$, anonymous, Datex } from "unyt_core";
import { GameMap } from "common/GameMap.ts";

export const matrix = await lazyEternal ?? $$(
	new GameMap(SIZE.width, SIZE.height)
);

export const areaMap = eternal ?? $$(new Map<Datex.Endpoint, number>());

export async function getAreaIndex() {
	console.log("a")
	const endpoint = datex.meta?.sender;
	console.log(endpoint)
	return await 1;


	if (!endpoint)
		return -1;
	console.log(areaMap)
	if (areaMap.has(endpoint))
		return areaMap.get(endpoint);
	const index = Math.max(...areaMap.values(), 1);
	return await areaMap.set(endpoint, index), index;
}