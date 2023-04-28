import { Point } from "./globals.ts";
import Tool from "./Tool.ts";
import { Area } from './AreaHandler.ts';
import { Array2d } from './Array2d.ts';
import { Tools } from './Tool.ts';

export default class DrawTool extends Tool {
	private isDrawing = false;
    private lastPoint?: Point = undefined;
	private matrix: Array2d;
    private _color = 1;
    private _size = 1;
    private allowedArea?: Area;

    override readonly type = Tools.Draw;

    public setColor(value: number) {
        this._color = value;
    }
    public get color() {
        return this._color;
    }

    public setSize(value: number) {
        this._size = value;
    }
    public get size() {
        return this._size;
    }

	constructor(matrix: Array2d, allowedArea?: Area) {
        super();
		this.matrix = matrix;
        allowedArea && (this.allowedArea = allowedArea);
	}

    public setArea(area: Area) {
        this.allowedArea = area;
    }

	public drawPoint(point: Point, color = 2, size = 1) {
        if (!this.allowedArea)
            return;
        const {x, y} = point;
        const radius = size - 1;
        for (let _x = x - radius; _x <= x + radius; _x++) {
          for (let _y = y - radius; _y <= y + radius; _y++) {
            if (!this.allowedArea.isInside({x: _x, y: _y}))
                continue;
            if (Math.sqrt((_x - x) ** 2 + (_y - y) ** 2) <= radius) {
                if (_x < this.matrix.width && this.matrix.get(_x, _y) >= 0)
                    this.matrix.set(_x, _y, color);
            }
          }
        }
    }

    private calculateMissingPoints(point1: Point, point2: Point) {
        const list: Point[] = [];
        const [ x2, y2 ] = [point2.x, point2.y];
        let [ x1, y1 ] = [point1.x, point1.y];

        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        while (x1 !== x2 || y1 !== y2) {
            list.push({ x: x1, y: y1});
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
        return list;
    }
    

    public onUp() {
        if (!this.isDrawing)
            return;
        this.isDrawing = false;
        this.lastPoint = undefined;
    }
    
	public onMove(point: Point) {
        if (!this.isDrawing)
            return;
        if (this.lastPoint) {
            const pointList = this.calculateMissingPoints(point, this.lastPoint);
            pointList.forEach(point => this.drawPoint(point, this.color, this.size));
        } else this.drawPoint(point, this.color, this.size)

        this.lastPoint = point;
    }

    public onDown(point: Point) {
        this.isDrawing = true;
        this.drawPoint(point, this.color, this.size);
    }
	
}