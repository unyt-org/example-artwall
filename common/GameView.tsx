import { UIX, IEL } from "uix/uix.ts";
import DrawTool from './DrawTool.ts';
import { COLORS, Point, Position, SIZE } from "./globals.ts";
import Tool from './Tool.ts';
import DragTool from './DragTool.ts';
import { Tools } from './Tool.ts';
import AreaHandler, { Area } from "./AreaHandler.ts";

import { Array2d } from "./Array2d.ts";
import { matrix, getAreaIndex } from "backend/entrypoint.tsx";
import { Datex } from "unyt_core/datex.ts";
Array2d

const scheduler = new Datex.UpdateScheduler(20);
scheduler.addPointer(matrix.data);

@UIX.template(
	<div id="view" style="opacity: 0">
        <div id="uiContainer">
            <span data-tool="Drag">
                {IEL`fa-up-down-left-right`} Explore
            </span>
            <span>
            <span id="download">
                {IEL`fa-download`} Download
            </span>
            </span>
            <span data-tool="Draw">
                {IEL`fa-pen`} <b>Draw!</b>
            </span>
        </div>
        <div id="toolContainer">
            <div class="colors palette">
                <div>
                    <span style={`--color:${COLORS[2]}`}></span>
                    <span style={`--color:${COLORS[1]}`}></span>
                    <span style={`--color:${COLORS[3]}`}></span>
                    <span style={`--color:${COLORS[4]}`}></span>
                    <span style={`--color:${COLORS[5]}`}></span>
                    <span style={`--color:${COLORS[6]}`}></span>
                    <span style={`--color:${COLORS[7]}`}></span>
                    <span style={`--color:${COLORS[8]}`}></span>
                </div>
                <div>
                    <span style={`--color:${COLORS[9]}`}></span>
                    <span style={`--color:${COLORS[10]}`}></span>
                    <span style={`--color:${COLORS[11]}`}></span>
                    <span style={`--color:${COLORS[12]}`}></span>
                    <span style={`--color:${COLORS[13]}`}></span>
                    <span style={`--color:${COLORS[14]}`}></span>
                    <span style={`--color:${COLORS[15]}`}></span>
                    <span style={`--color:${COLORS[16]}`}></span>
                </div>
            </div> 
            <div class="tools">
                <img data-size={1} src="./res/assets/pen-1.png"/>
                <img data-size={3} src="./res/assets/pen-2.png"/>
                <img data-size={5} src="./res/assets/pen-3.png"/>
                <img data-size={-1} src="./res/assets/rubber.png"/>
            </div>
            <div class="color-picker">
                <div class="colors">
                    <div>
                        <span style={`--color:${COLORS[2]}`}></span>
                        <span style={`--color:${COLORS[1]}`}></span>
                        <span style={`--color:${COLORS[3]}`}></span>
                        <span style={`--color:${COLORS[4]}`}></span>
                        <span style={`--color:${COLORS[5]}`}></span>
                        <span style={`--color:${COLORS[6]}`}></span>
                        <span style={`--color:${COLORS[7]}`}></span>
                        <span style={`--color:${COLORS[8]}`}></span>
                    </div>
                    <div>
                        <span style={`--color:${COLORS[9]}`}></span>
                        <span style={`--color:${COLORS[10]}`}></span>
                        <span style={`--color:${COLORS[11]}`}></span>
                        <span style={`--color:${COLORS[12]}`}></span>
                        <span style={`--color:${COLORS[13]}`}></span>
                        <span style={`--color:${COLORS[14]}`}></span>
                        <span style={`--color:${COLORS[15]}`}></span>
                        <span style={`--color:${COLORS[16]}`}></span>
                    </div>
                </div>
            </div>
        </div>
        <div id="gameContainer">
            <canvas id="canvas" style={{boxSizing:'border-box'}}/>
        </div>
    </div>
)
export class GameView extends UIX.BaseComponent<UIX.BaseComponent.Options> {

	@UIX.id declare canvas: HTMLCanvasElement
    @UIX.id declare gameContainer: HTMLDivElement
	declare drawTool: DrawTool;
	declare dragTool: DragTool;
    private declare areaHandler: AreaHandler;

    ctx!: CanvasRenderingContext2D;

    position: Position = {
        x: 0,
        y: 0,
        scale: 10
    }
    private activeTool?: Tool;

    public matrix: Array2d = matrix;

    private export() {
        const position = {...this.position};
        this.position.scale = Math.min(
            (window.innerWidth / SIZE.width),
            (window.innerHeight / SIZE.height)
        ) * 0.99;
        this.alignPosition();
        this.draw(true);
        
        const link = document.createElement('a');
        link.setAttribute('href', this.canvas.toDataURL());
        link.setAttribute('download', "unyt-artwall.png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.scale = position.scale;
    }

    private alignCanvas() {
        this.position.scale = Math.min(
            (window.innerWidth / SIZE.width),
            (window.innerHeight / SIZE.height)
        ) * 0.99;

        this.position.scale = 6;
        this.alignPosition();
    }
    private alignPosition() {
        const dX = window.innerWidth/2 - (SIZE.width * this.position.scale / 2);
        const dY = window.innerHeight/2 - (SIZE.height * this.position.scale / 2);
        this.position.x = dX;
        this.position.y = dY;
    }

	get width() { return this.gameContainer.getBoundingClientRect().width }
	get height() { return this.gameContainer.getBoundingClientRect().height }

	protected override async onDisplay() {
        this.alignCanvas();
        this.areaHandler = new AreaHandler(this);
        this.dragTool = new DragTool(this.position);
        this.drawTool = new DrawTool(this.matrix);

        this.setTool(Tools.Drag);

		this.ctx = this.canvas.getContext("2d")!;   
		this.ctx.imageSmoothingEnabled = false;

		this.addListeners();
		this.onResize();
		this.draw();

        await new Promise((r)=>setTimeout(r, 1000));
        this.querySelector("div")?.classList.add("visible");
	}

    private async requestArea() {
        if (!this.drawArea) {
            const index = await getAreaIndex();
            console.log(index)
            if (!index)
                return;
            this.drawArea = this.areaHandler.addArea(index);
            this.drawTool.setArea(this.drawArea);
        }

        this.position.scale = Math.min(
            (window.innerWidth / this.drawArea.size),
            (window.innerHeight / this.drawArea.size)
        ) * 0.99;

        this.position.x = -this.position.scale * this.drawArea.tl.x + (window.innerWidth - this.position.scale * this.drawArea.size) / 2;
        this.position.y = -this.position.scale * this.drawArea.tl.y + (window.innerHeight - this.position.scale * this.drawArea.size) / 2;
    }

    public setTool(tool: Tools) {
        document.body.style.cursor = 'default';
        if (tool === Tools.Drag) {
            document.body.style.cursor = 'grab';
            return this.activeTool = this.dragTool;
        }
        if (tool === Tools.Draw)
            return this.activeTool = this.drawTool;
    }


	protected addListeners() {
        new ResizeObserver(() => {
            this.onResize()
        }).observe(document.body);

        this.querySelector("#download")?.addEventListener("click", () => this.export());

        const colorPicker = this.querySelector("#toolContainer .color-picker") as HTMLDivElement;
        this.addEventListener('click', () => {
            colorPicker.classList.toggle("active", false);
        }); 

        colorPicker.addEventListener("click", (e) => {
            if (+this.querySelector("#toolContainer .tools img.active")?.getAttribute("data-size")! === -1)
                return;
            colorPicker.classList.toggle("active");
            e.stopPropagation();
        });
        this.querySelectorAll("#toolContainer .colors span").forEach((_elem) => {
            const elem = _elem as HTMLElement;
            const color = COLORS.indexOf(elem.style.getPropertyValue("--color")?.trim());
            elem.addEventListener("click", (e) => {
                this.querySelectorAll("#toolContainer .colors span").forEach((e) => e.classList.toggle("active", (e as HTMLElement).style.getPropertyValue("--color") === elem.style.getPropertyValue("--color")));
                this.drawTool.setColor(color);
                colorPicker.style.setProperty("--color", COLORS[color]);
                colorPicker.classList.toggle("active", false);
                e.stopPropagation();
            })
        });
        this.querySelectorAll("#toolContainer .tools img").forEach((_elem) => {
            const elem = _elem as HTMLElement;
            const size = +elem.getAttribute("data-size")! || 1;
            elem.addEventListener("click", () => {
                this.querySelectorAll("#toolContainer .tools img").forEach(e => e.classList.toggle("active", e === elem))
                if (size === -1) {
                    colorPicker.style.setProperty("--color", COLORS[0]);
                    this.drawTool.setSize(3);
                    this.drawTool.setColor(0);
                } else this.drawTool.setSize(size);
            });
        });

        this.querySelectorAll("#uiContainer > *").forEach((elem) => {
            const tool = elem.getAttribute("data-tool") as unknown as 0;
            elem.addEventListener("click", () => {
                if (Tools[tool] !== undefined) {
                    this.querySelectorAll("#uiContainer > *").forEach(e => e.classList.toggle("active", e === elem));
                    const _tool = Tools[tool] as unknown as Tools;
                    this.setTool(_tool)
                    if (_tool === Tools.Draw)
                        this.requestArea();
                }
            })
        });

        UIX.Res.addShortcut("search", "ctrl+d")
		UIX.Handlers.handleShortcut(globalThis.window, "search", () => 
            this.querySelector("#view")?.classList.toggle("empty"));

        this.canvas.addEventListener("wheel", (e) => {
            if (this.activeTool === this.dragTool ||
                this.activeTool === this.drawTool) {
                const point = this.getScreenPoint(e);
                if (!point)
                    return;
                const zoomIn = e.deltaY > 0;
                this.dragTool.onZoom(point, zoomIn);
            }
        });
        this.canvas.addEventListener("mousedown", this.onDown.bind(this));
        this.canvas.addEventListener("touchstart", this.onDown.bind(this));

        this.canvas.addEventListener("mousemove", this.onMove.bind(this));
        this.canvas.addEventListener("touchmove", this.onMove.bind(this));

        document.body.addEventListener("mouseup", this.onUp.bind(this));
        document.body.addEventListener("touchend", this.onUp.bind(this));


        (document.body.querySelector("#toolContainer .colors span")! as HTMLElement)
            .click();
        (document.body.querySelector("#toolContainer .tools img")! as HTMLElement)
            .click();
        (document.body.querySelector("#uiContainer > *")! as HTMLElement)
            .click();
	}

    private onUp(_: MouseEvent | TouchEvent) {
        this.prefDist = 0;
        if (this.activeTool === this.drawTool) {
            document.body.style.cursor = 'default';
            this.drawTool.onUp()
        } else if (this.activeTool === this.dragTool) {
            document.body.style.cursor = 'grab';
            this.dragTool.onUp();
        }
    }

    private prefDist = 0;
    private onMove(e: MouseEvent | TouchEvent) {
        if (this.activeTool === this.drawTool) {
            const point = this.getPixelPoint(e);
            if (!point) return;
            if (this.drawArea?.isInside(point))
                this.drawTool.onMove(point);
        } else if (this.activeTool === this.dragTool) {
            const point = this.getScreenPoint(e);
            if (globalThis.TouchEvent && e instanceof TouchEvent && e.touches.length === 2) {
                const touch1: Point = { x: e.touches[0].pageX, y: e.touches[0].pageY };
                const touch2: Point = { x: e.touches[1].pageX, y: e.touches[1].pageY };
                const dist = Math.hypot(touch1.x - touch2.x, touch1.y - touch2.y);
                const center: Point = {
                    x: (touch1.x + touch2.x)/2,
                    y: (touch1.y + touch2.y)/2
                };
                if (!this.prefDist)
                    this.prefDist = dist;

                const factor = (dist / this.prefDist) * (
                    dist > this.prefDist ? 1/0.97 : 0.97
                );

                this.dragTool.onZoom(center, factor);
                this.prefDist = dist;
            } else if (point) this.dragTool.onMove(point);
        }
    }
    private onDown(e: MouseEvent | TouchEvent) {
        if (this.activeTool === this.drawTool) {
            const point = this.getPixelPoint(e);
            if (!point) return;
            if (this.drawArea?.isInside(point))
                this.drawTool.onDown(point);
        } else if (this.activeTool === this.dragTool) {
            document.body.style.cursor = 'move';
            const point = this.getScreenPoint(e);
            point && this.dragTool.onDown(point);
        }
    }

    private getScreenPoint(e: MouseEvent | TouchEvent): Point | null {
        if (e instanceof MouseEvent)
            return {
                x: e.clientX,
                y: e.clientY
            };
        if (!e.touches.length)
            return null;
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
    private getPixelPoint(e: MouseEvent | TouchEvent): Point | null {
        if (e instanceof MouseEvent)
            return {
                x: Math.floor((e.clientX - this.position.x) / this.position.scale),
                y: Math.floor((e.clientY - this.position.y) / this.position.scale)
            };
        if (!e.touches.length)
            return null;
        return {
            x: Math.floor((e.touches[0].clientX - this.position.x) / this.position.scale),
            y: Math.floor((e.touches[0].clientY - this.position.y) / this.position.scale)
        }
    }

    private drawArea?: Area;
 
    protected onResize() {
        const scale = window.devicePixelRatio;

        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.canvas.setAttribute("width", (width*scale).toString())
        this.canvas.setAttribute("height", (height*scale).toString())

        this.ctx.scale(scale, scale);
        this.ctx.imageSmoothingEnabled = false;

        this.alignCanvas();
    }


    draw(screenshot?: boolean) {
        // reset
        this.ctx.clearRect(0, 0, this.width, this.height);
     

        if (this.drawArea && this.activeTool && this.activeTool.type === Tools.Draw) {
            const {x,y} = this.drawArea.tl;
            const posX = Math.floor(x * this.position.scale + this.position.x), 
                  posY = Math.floor(y * this.position.scale + this.position.y);
            const size = Math.ceil(this.position.scale * this.drawArea.size);
            this.ctx.strokeStyle = "white";
            this.ctx.setLineDash([5,10]);
            this.ctx.strokeRect(posX, posY, size, size);
        }
        const renderStart: Point = {
            x: Math.floor(Math.max(-this.position.x / this.position.scale, 0)),
            y: Math.floor(Math.max(-this.position.y / this.position.scale, 0))
        }
        const renderEnd: Point = {
            x: Math.ceil(Math.min(Math.ceil(renderStart.x + window.innerWidth / this.position.scale), this.matrix.width)),
            y: Math.ceil(Math.min(Math.ceil(renderStart.y + window.innerHeight / this.position.scale), this.matrix.height))
        }
        
        const resolution = screenshot ? 
            1 : 
            +(1 + 1.2*Math.max(0, ((renderEnd.y - renderStart.x) / SIZE.width - 0.5))).toFixed(1);
        for (let y = renderStart.y - renderStart.y % resolution; y < renderEnd.y; y += resolution) {
            for (let x = renderStart.x - renderStart.x % resolution; x < renderEnd.x; x += resolution) {
                const posX = Math.floor(x * this.position.scale + this.position.x);
                const posY = Math.floor(y * this.position.scale + this.position.y);
                const size = Math.ceil(this.position.scale * resolution);
                const color = this.matrix.get(Math.floor(x), Math.floor(y));
                if (color && posX < this.width && posY < this.height) {
                    this.ctx.fillStyle = this.getColor(color);
                    this.ctx.fillRect(posX, posY, size, size);
                }
            }
        }
        if (!screenshot) globalThis.requestAnimationFrame(() => this.draw());
    }

    private getColor(color: number): string {
        if (color === 100)
            return "white";
        return COLORS[Math.abs(color)] ?? "transparent"
    }

}
