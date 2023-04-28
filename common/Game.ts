import { Datex, constructor } from "unyt_core/datex.ts";
import { expose, remote, scope } from "unyt_core/datex_all.ts";

// @sync @scope 
export class Game {

	static createNew() {		
		const id = Datex.Runtime.endpoint.toString();
		console.log("id>",id);
		const game = new Game()
		return game;
	}

    @property ghosts = new Set<any>()
    @property running = true;


    update(){
        if (!this.running) return;
        for (const ghost of this.ghosts) ghost.update()
    }

}
