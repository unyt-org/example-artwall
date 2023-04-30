import type { inferDatexType } from "unyt_core/types/type.ts";
import { Datex, constructor } from "unyt_core/datex.ts";

@sync("Array2d") export class Array2d {
    @property width!: number
    @property height!: number
    @property data!: inferDatexType<typeof Datex.Type.std.Array_8>
	
    constructor(width: number, height: number) {}
	@constructor construct(width: number, height: number) {
		this.width = width;
		this.height = height;
        const data = new Array(this.width * this.height).fill(0);
        // treat as mutable <Array/u8> in DATEX, normal Array in JS
        Datex.Type.bindType(data, Datex.Type.std.Array_8);
		this.data = data;
	}

    get(x:number, y:number) {
        return this.data[y*this.width+x];
    }

    set(x:number, y:number, value:number) {
        this.data[y*this.width+x] = value;
    }
}
