import { anonymous, Datex } from "unyt_core/datex.ts";

export class GameMap extends Array {

    width!: number
    height!: number

    constructor(width?:number, height?:number)
    constructor(width?:number, height?:number, data?:number[])
    constructor(matrix:number[][])
    constructor(width_or_matrix?:number|number[][], height?:number, data?:number[]){
        super()
        // width*height
        if (typeof width_or_matrix == "number") {
            const width = width_or_matrix;
            this.length = width*(height??0);
            this.width = width;
            this.height = (height??0);
            this.fill(0, 0, this.width*this.height);
        }
        // initial matrix
        else if (typeof width_or_matrix == "object"){
            const matrix = width_or_matrix
            this.width = matrix[0].length;
            this.height = matrix.length;

            for(const row of matrix) {
                this.push(...row)
            }
        }

        // clone data to self
        if (data) {
            this.length = 0;
            this.push.apply(this, data);
        }
    }

    get(x:number, y:number){
        return this[y*this.width+x];
    }

    set(x:number, y:number, value:number){
        this[y*this.width+x] = value;
    }

}

const SET = Symbol("SET");

Datex.Type.get("ext", "GameMap").setJSInterface({
    class: GameMap,

    serialize: (value:GameMap) => {
        const data = new Uint16Array(2+value.width*value.height)
        data[0] = value.width;
        data[1] = value.height;
        data.set(value, 2);
        return data;
    },
    

    empty_generator: ()=>new GameMap(),

    cast: value => {
        if (value instanceof ArrayBuffer) {
            const uint8 = new Uint16Array(value)
            const width = uint8[0], height = uint8[1];
            const data = [...uint8.slice(2)]
            const b = new GameMap(width, height, data);
            return b
        }

        else if (value instanceof Array) {
            for (const row of value) {
                if (!(row instanceof Array)) return Datex.INVALID;
            }
            return new GameMap(value);
        }
        return Datex.INVALID;
    },


    create_proxy: (obj:GameMap, pointer) => {
        pointer[SET] = obj.set;

        // override methods
        Object.defineProperty(obj, "set", {value:(x:number, y:number, value:number) => {
                return pointer.handleSet(anonymous([x,y]), value);
            }, writable:false, enumerable:false});

        return obj;
    },

    set_property_silently: (parent:GameMap, key:[number,number]|number|bigint, value, pointer:Datex.Pointer) => {
        if (typeof key == "number" || typeof key == "bigint") parent[Number(key)] = value // normal array set
        else pointer[SET].call(parent, key[0], key[1], value) // set(x,y,value)
    },
    
    set_property: (parent:GameMap, key:[number,number]|number|bigint, value) => {
        if (typeof key == "number" || typeof key == "bigint") parent[Number(key)] = value // normal array set
        else parent.set(key[0], key[1], value) // set(x,y,value)
    },

    get_property: (parent:GameMap, key:[number,number]|number|bigint) => {
        if (typeof key == "number" || typeof key == "bigint") return parent[Number(key)] // normal array get
        else return parent.get(key[0], key[1]) // get(x,y)
    }
})