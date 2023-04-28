import { Datex } from "unyt_core/datex.ts";

// @sync @scope 
export class Game {
	static createNew() {		
		const id = Datex.Runtime.endpoint.toString();
		console.log("id>",id);
		const game = new Game()
		return game;
	}
    @property running = true;
    update() {
        if (!this.running) return;
    }
}
