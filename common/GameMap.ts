
import { anonymous, constructor, Datex, replicator } from "unyt_core/datex.ts";


@sync("GameMap") export class GameMap {
    @property width = 0
    @property height = 0
    @property data!:Int8Array;
	#int8Array!: Int8Array;
	
    constructor(width: number, height: number) { }
	@constructor construct(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.data = new Int8Array(this.width * this.height).fill(0);
		this.#int8Array = this.data;
	}

	@replicator replicate() {
		if (!(this.data instanceof Int8Array))
			this.#int8Array = new Int8Array(this.data);
	}
	
	
    get(x:number, y:number) {
        return this.#int8Array[y*this.width+x];
    }

    set(x:number, y:number, value:number) {
        this.#int8Array[y*this.width+x] = value;
    }
}
