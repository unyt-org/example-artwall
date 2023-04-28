import { constructor } from "unyt_core/datex.ts";

@sync("GameMap") export class Array2d {
    @property width = 0
    @property height = 0

    @property data!:Array<number>;
	
    constructor(width: number, height: number) { }
	@constructor construct(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.data = new Array(this.width * this.height).fill(0);
	}

    get(x:number, y:number) {
        return this.data[y*this.width+x];
    }

    set(x:number, y:number, value:number) {
        this.data[y*this.width+x] = value;
    }
}
