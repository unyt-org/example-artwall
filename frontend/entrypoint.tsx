import {UIX} from "uix";

import { Game } from "common/Game.ts";
import { GameView } from "common/GameView.tsx";
import { Datex } from "unyt_core/datex.ts";

UIX.Theme.setMode("dark")
Datex.Compiler.SIGN_DEFAULT = false;

export default {
	// create new game
	'*': UIX.once(() => <GameView game={Game.createNew()}/>)
} satisfies UIX.Entrypoint