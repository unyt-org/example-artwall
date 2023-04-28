import { Point, Position } from "./globals.ts";
import Tool from "./Tool.ts";
import { SIZE } from './globals.ts';

export default class DragTool extends Tool {
	private position: Position;
	private isDragging = false;
    private lastPoint?: Point = undefined;

	constructor(position: Position) {
		super();
		this.position = position;
	}


	public onUp() {
        if (!this.isDragging)
            return;
		this.isDragging = false;
    }
    
	public onMove(point: Point) {
        if (!this.isDragging || !this.lastPoint)
            return;
		const dX = point.x - this.lastPoint.x;
		const dY = point.y - this.lastPoint.y;

		this.position.x += dX;
		this.position.y += dY;

		this.lastPoint = point;
    }

	public onZoom(point: Point, zoomFactor: number): void;
	public onZoom(point: Point, zoomIn: boolean): void;
	public onZoom(point: Point, zoom: boolean | number): void {
		const scale = typeof zoom === "boolean" ? (zoom ? 0.9 : 1.1): zoom;
		const newScale = this.position.scale * scale;
		const dx = (point.x - this.position.x) * (1 - scale);
		const dy = (point.y - this.position.y) * (1 - scale);
		this.position.x += dx;
		this.position.y += dy;
		this.position.scale = newScale;
	}

    public onDown(point: Point) {
		this.isDragging = true;
		this.lastPoint = point;
	}
}