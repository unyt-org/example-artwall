
import { anonymous, constructor, Datex, replicator } from "unyt_core/datex.ts";


@sync("GameMap") export class GameMap {

    @property width = 0
    @property height = 0
    @property data!:Uint8Array;
	#uint8Array!: Uint8Array;

	
    constructor(width: number, height: number) { }
	@constructor construct(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.data = new Uint8Array(this.width * this.height).fill(0);
		this.#uint8Array = this.data;
	}

	@replicator replicate() {
		if (!(this.data instanceof Uint8Array))
			this.#uint8Array = new Uint8Array(this.data);
	}
	
	
    get(x:number, y:number) {
        return this.#uint8Array[y*this.width+x];
    }

    set(x:number, y:number, value:number) {
        this.#uint8Array[y*this.width+x] = value;
    }


}
